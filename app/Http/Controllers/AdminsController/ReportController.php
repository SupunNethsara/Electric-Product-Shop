<?php

namespace App\Http\Controllers\AdminsController;

use App\Models\Order;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Http\Controllers\Controller;

class ReportController extends Controller
{
    public function getOrders(Request $request)
    {
        try {
            $startDate = $request->get('start_date', Carbon::now()->subDays(30)->format('Y-m-d'));
            $endDate = $request->get('end_date', Carbon::now()->format('Y-m-d'));
            $status = $request->get('status', 'all');

            $query = Order::with(['user.profile'])
            ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59']);

            if ($status !== 'all') {
                $query->where('status', $status);
            }

            $orders = $query->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'order_code' => $order->order_code,
                        'customer_name' => $order->user ? $order->user->name : 'Guest',
                        'customer_email' => $order->user ? $order->user->email : 'N/A',
                        'customer_phone' => $order->user && $order->user->profile ? $order->user->profile->phone : 'N/A',
                        'total_amount' => $order->total_amount,
                        'status' => $order->status,
                        'created_at' => $order->created_at,
                        'updated_at' => $order->updated_at,
                        'items_count' => $order->orderItems ? $order->orderItems->count() : 0,
                    ];
                });

            return response()->json([
                'success' => true,
                'orders' => $orders,
                'filters' => [
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'status' => $status,
                    'total_orders' => $orders->count()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getStats(Request $request)
    {
        try {
            $startDate = $request->get('start_date', Carbon::now()->subDays(30)->format('Y-m-d'));
            $endDate = $request->get('end_date', Carbon::now()->format('Y-m-d'));

            // Total orders count
            $totalOrders = Order::whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])->count();

            // Orders by status
            $pendingOrders = Order::where('status', 'pending')
                ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
                ->count();

            $contactedOrders = Order::where('status', 'contacted')
                ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
                ->count();

            $completedOrders = Order::where('status', 'completed')
                ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
                ->count();

            $cancelledOrders = Order::where('status', 'cancelled')
                ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
                ->count();

            // Revenue calculations
            $totalRevenue = Order::where('status', 'completed')
                ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
                ->sum('total_amount');

            $averageOrderValue = $completedOrders > 0 ? $totalRevenue / $completedOrders : 0;

            // Orders trend (last 7 days for chart data)
            $last7Days = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i)->format('Y-m-d');
                $dayOrders = Order::whereDate('created_at', $date)->count();
                $last7Days[] = [
                    'date' => $date,
                    'orders' => $dayOrders
                ];
            }

            // Most recent orders for quick overview
            $recentOrders = Order::with(['user'])
                ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'order_number' => $order->order_number,
                        'customer_name' => $order->user ? $order->user->name : 'Guest',
                        'total_amount' => $order->total_amount,
                        'status' => $order->status,
                        'created_at' => $order->created_at
                    ];
                });

            return response()->json([
                'success' => true,
                'stats' => [
                    'total_orders' => $totalOrders,
                    'pending_orders' => $pendingOrders,
                    'contacted_orders' => $contactedOrders,
                    'completed_orders' => $completedOrders,
                    'cancelled_orders' => $cancelledOrders,
                    'total_revenue' => (float) $totalRevenue,
                    'average_order_value' => (float) $averageOrderValue,
                    'completion_rate' => $totalOrders > 0 ? ($completedOrders / $totalOrders) * 100 : 0
                ],
                'trends' => [
                    'last_7_days' => $last7Days
                ],
                'recent_orders' => $recentOrders,
                'date_range' => [
                    'start' => $startDate,
                    'end' => $endDate
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function exportOrders(Request $request)
    {
        try {
            $startDate = $request->get('start_date', Carbon::now()->subDays(30)->format('Y-m-d'));
            $endDate = $request->get('end_date', Carbon::now()->format('Y-m-d'));
            $status = $request->get('status', 'all');
            $format = $request->get('format', 'json');

            $query = Order::with(['user', 'orderItems.product'])
                ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59']);

            if ($status !== 'all') {
                $query->where('status', $status);
            }

            $orders = $query->orderBy('created_at', 'desc')->get();

            $exportData = $orders->map(function ($order) {
                return [
                    'Order ID' => $order->order_number,
                    'Customer Name' => $order->user ? $order->user->name : 'Guest',
                    'Customer Email' => $order->user ? $order->user->email : 'N/A',
                    'Customer Phone' => $order->user ? $order->user->phone : 'N/A',
                    'Total Amount' => $order->total_amount,
                    'Status' => ucfirst($order->status),
                    'Order Date' => $order->created_at->format('Y-m-d H:i:s'),
                    'Items Count' => $order->orderItems ? $order->orderItems->count() : 0,
                    'Items' => $order->orderItems ? $order->orderItems->map(function ($item) {
                        return $item->product ? $item->product->name : 'Unknown Product';
                    })->implode(', ') : 'No items'
                ];
            });

            // For now, return JSON response
            // You can implement Excel/PDF export later using appropriate packages
            if ($format === 'excel') {
                // Future implementation for Excel export
                // return Excel::download(new OrdersExport($orders), "orders_{$startDate}_to_{$endDate}.xlsx");
                return response()->json([
                    'success' => true,
                    'message' => 'Excel export will be implemented with Laravel Excel package',
                    'data' => $exportData,
                    'export_info' => [
                        'type' => 'orders',
                        'format' => 'excel',
                        'date_range' => "{$startDate} to {$endDate}",
                        'status_filter' => $status,
                        'total_records' => $exportData->count()
                    ]
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $exportData,
                'export_info' => [
                    'type' => 'orders',
                    'format' => $format,
                    'date_range' => "{$startDate} to {$endDate}",
                    'status_filter' => $status,
                    'total_records' => $exportData->count()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to export orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get detailed order analytics
     */
    public function getOrderAnalytics(Request $request)
    {
        try {
            $startDate = $request->get('start_date', Carbon::now()->subDays(30)->format('Y-m-d'));
            $endDate = $request->get('end_date', Carbon::now()->format('Y-m-d'));

            // Monthly breakdown for charts
            $monthlyData = [];
            $currentDate = Carbon::parse($startDate);
            $endDateObj = Carbon::parse($endDate);

            while ($currentDate <= $endDateObj) {
                $month = $currentDate->format('Y-m');
                $monthOrders = Order::whereYear('created_at', $currentDate->year)
                    ->whereMonth('created_at', $currentDate->month)
                    ->count();
                $monthRevenue = Order::where('status', 'completed')
                    ->whereYear('created_at', $currentDate->year)
                    ->whereMonth('created_at', $currentDate->month)
                    ->sum('total_amount');

                $monthlyData[] = [
                    'month' => $currentDate->format('M Y'),
                    'orders' => $monthOrders,
                    'revenue' => (float) $monthRevenue
                ];

                $currentDate->addMonth();
            }

            // Status distribution
            $statusDistribution = Order::whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
                ->selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->get()
                ->mapWithKeys(function ($item) {
                    return [$item->status => $item->count];
                });

            // Top customers by order count
            $topCustomers = Order::with('user')
                ->whereBetween('created_at', [$startDate, $endDate . ' 23:59:59'])
                ->whereNotNull('user_id')
                ->selectRaw('user_id, COUNT(*) as order_count, SUM(total_amount) as total_spent')
                ->groupBy('user_id')
                ->orderBy('order_count', 'desc')
                ->take(10)
                ->get()
                ->map(function ($item) {
                    return [
                        'customer_name' => $item->user ? $item->user->name : 'Unknown',
                        'customer_email' => $item->user ? $item->user->email : 'N/A',
                        'order_count' => $item->order_count,
                        'total_spent' => (float) $item->total_spent
                    ];
                });

            return response()->json([
                'success' => true,
                'analytics' => [
                    'monthly_breakdown' => $monthlyData,
                    'status_distribution' => $statusDistribution,
                    'top_customers' => $topCustomers
                ],
                'date_range' => [
                    'start' => $startDate,
                    'end' => $endDate
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch analytics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
