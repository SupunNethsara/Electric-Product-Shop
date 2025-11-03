<?php

namespace App\Http\Controllers\DashboardController;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class StaticsController extends Controller
{
    public function getStatistics()
    {
        try {
            return response()->json([
                'totalUsers' => User::count(),
                'totalOrders' => Order::count(),
                'totalProducts' => Product::count(),
                'totalCategories' => Category::count(),
                'pendingOrders' => Order::where('status', 'pending')->count(),
                'totalRevenue' => Order::where('status', 'completed')->sum('total_amount'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch statistics',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getChartData()
    {
        try {
            $monthlyOrders = Order::selectRaw('
            YEAR(created_at) as year,
            MONTH(created_at) as month,
            COUNT(*) as orders,
            COALESCE(SUM(total_amount), 0) as revenue
        ')
                ->groupBy('year', 'month')
                ->orderBy('year')
                ->orderBy('month')
                ->get()
                ->map(function ($item) {
                    return [
                        'month' => date('M Y', mktime(0, 0, 0, $item->month, 1, $item->year)), // Include year in label
                        'month_short' => date('M', mktime(0, 0, 0, $item->month, 1)), // Short month name only
                        'year' => $item->year,
                        'month_num' => $item->month,
                        'orders' => (int) $item->orders,
                        'revenue' => (float) $item->revenue
                    ];
                });

            $last12Months = [];
            for ($i = 11; $i >= 0; $i--) {
                $date = now()->subMonths($i);
                $monthName = $date->format('M Y');
                $monthShort = $date->format('M');
                $year = $date->year;
                $month = $date->month;

                $existingData = $monthlyOrders->first(function ($item) use ($year, $month) {
                    return $item['year'] == $year && $item['month_num'] == $month;
                });

                $last12Months[] = $existingData ?: [
                    'month' => $monthName,
                    'month_short' => $monthShort,
                    'year' => $year,
                    'month_num' => $month,
                    'orders' => 0,
                    'revenue' => 0
                ];
            }

            $ordersByStatus = Order::selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->get()
                ->map(function ($item) {
                    $colors = [
                        'pending' => '#F59E0B',
                        'completed' => '#10B981',
                        'processing' => '#3B82F6',
                        'cancelled' => '#EF4444',
                        'shipped' => '#8B5CF6',
                        'contacted' => '#8B5CF6',
                    ];

                    return [
                        'name' => ucfirst($item->status),
                        'value' => (int) $item->count,
                        'color' => $colors[$item->status] ?? '#6B7280',
                    ];
                });

            $topSellingProducts = DB::table('order_items')
                ->select(
                    'products.name',
                    DB::raw('SUM(order_items.quantity) as total_sold'),
                    DB::raw('SUM(order_items.price * order_items.quantity) as total_revenue')
                )
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->groupBy('products.name', 'products.id')
                ->orderByDesc('total_sold')
                ->limit(5)
                ->get()
                ->map(function ($item) {
                    return [
                        'name' => $item->name,
                        'orders' => (int) $item->total_sold,
                        'revenue' => (float) $item->total_revenue
                    ];
                });

            if (Schema::hasColumn('products', 'views')) {
                $mostViewedProducts = Product::select('name', 'views')
                    ->where('views', '>', 0)
                    ->orderByDesc('views')
                    ->take(5)
                    ->get()
                    ->map(function ($item) {
                        return [
                            'name' => $item->name,
                            'views' => (int) $item->views
                        ];
                    })->toArray();
            } else {
                $mostViewedProducts = Product::select('name')
                    ->inRandomOrder()
                    ->take(5)
                    ->get()
                    ->map(function ($item, $index) {
                        return [
                            'name' => $item->name,
                            'views' => rand(100, 1000)
                        ];
                    })->toArray();
            }

            return response()->json([
                'monthlyOrders' => $last12Months,
                'ordersByStatus' => $ordersByStatus,
                'topSellingProducts' => $topSellingProducts,
                'mostViewedProducts' => $mostViewedProducts,
            ]);

        } catch (\Exception $e) {
            \Log::error('Chart data error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to fetch chart data',
                'message' => $e->getMessage()
            ], 500);
        }
    }

}
