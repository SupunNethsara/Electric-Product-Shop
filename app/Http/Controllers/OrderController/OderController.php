<?php

namespace App\Http\Controllers\OrderController;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrderRequest;
use App\Mail\NewOrderNotification;
use App\Models\Order;
use App\Models\OrderItem;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class OderController extends Controller
{
    public function getAllOrder()
    {
        return response()->json([
            'orders' => Order::with('user')
                ->orderBy('created_at', 'desc')
                ->get()
        ]);
    }
    public function getAllOrderNotification()
    {
        return response()->json([
            'orders' => Order::with('user')->where('read' , false)
                ->orderBy('created_at', 'desc')
                ->get()
        ]);
    }

    public function getUserOrder(Request $request)
    {
        $orderCode = $request->input('order_code');

        $order = Order::with('user.profile')->where('order_code', $orderCode)->first();

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $orderItems = OrderItem::where('order_id', $order->id)
            ->with('product')
            ->get();

        return response()->json([
            'order' => $order,
            'items' => $orderItems,
            'user' => $order->user,
            'profile' => $order->user->profile ?? null,
        ]);
    }
    public function getUserOrders(Request $request)
    {
        $userId = Auth::id();

        $orders = Order::where('user_id', $userId)
            ->with('user.profile')
            ->orderBy('created_at', 'desc')
            ->get();

        if ($orders->isEmpty()) {
            return response()->json([]);
        }

        $ordersWithItems = [];
        foreach ($orders as $order) {
            $orderItems = OrderItem::where('order_id', $order->id)
                ->with('product')
                ->get();

            $ordersWithItems[] = [
                'order' => $order,
                'items' => $orderItems,
                'user' => $order->user,
                'profile' => $order->user->profile ?? null,
            ];
        }

        return response()->json($ordersWithItems);
    }
    public function updateStatus(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'status' => 'required|in:pending,contacted,processing,shipped,completed,cancelled'
        ]);

        try {
            $order = Order::findOrFail($request->order_id);
            $oldStatus = $order->status;
            $order->status = $request->status;
            $order->save();

            // You can add status history logging here if needed
            // StatusHistory::create([
            //     'order_id' => $order->id,
            //     'from_status' => $oldStatus,
            //     'to_status' => $request->status,
            //     'changed_by' => Auth::id()
            // ]);

            return response()->json([
                'success' => true,
                'message' => 'Order status updated successfully',
                'order' => $order
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function sendOrderNotification(Order $order, $orderItems)
    {
        try {
            $ownerEmail = env('MAIL_FROM_ADDRESS', 'supunmax663@gmail.com');

            Mail::to($ownerEmail)->send(new NewOrderNotification($order, $orderItems));

            Log::info('Order notification email sent successfully for order: ' . $order->order_code);

        } catch (Exception $e) {
            Log::error('Failed to send order notification email: ' . $e->getMessage());
        }
    }

    public function directOrder(OrderRequest $request)
    {
        $request->validated();

        try {
            DB::beginTransaction();

            $order = Order::create([
                'user_id' => Auth::id(),
                'order_code' => 'ORD-' . time(),
                'total_amount' => $request->total_amount,
                'delivery_fee' => $request->delivery_fee,
                'delivery_option' => $request->delivery_option,
                'status' => 'pending',
            ]);

            $orderItems = [];
            foreach ($request->items as $item) {
                $product = \App\Models\Product::find($item['product_id']);

                if (!$product) {
                    throw new Exception("Product not found: ID {$item['product_id']}");
                }

                if ($product->availability < $item['quantity']) {
                    throw new Exception("Not enough stock for product: {$product->name}");
                }

                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);

                $orderItems[] = $orderItem;

                $product->availability -= $item['quantity'];
                $product->save();
            }

            DB::commit();

            $this->sendOrderNotification($order, $orderItems);

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully!',
                'order' => $order->load('items')
            ], 201);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function cartCheckout(OrderRequest $request)
    {
        $request->validated();

        try {
            DB::beginTransaction();

            $order = Order::create([
                'user_id' => Auth::id(),
                'order_code' => 'ORD-' . time(),
                'total_amount' => $request->total_amount,
                'delivery_fee' => $request->delivery_fee,
                'delivery_option' => $request->delivery_option,
                'status' => 'pending',
            ]);

            $orderItems = [];
            foreach ($request->items as $item) {
                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
                $orderItems[] = $orderItem;
            }

            DB::commit();

            $this->sendOrderNotification($order, $orderItems);

            return response()->json(['success' => true, 'order' => $order->load('items')], 201);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function markAsRead($orderId)
    {
        try {
            $order = Order::find($orderId);

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found'
                ], 404);
            }

            $order->read = true;
            $order->read_at = now();
            $order->save();

            return response()->json([
                'success' => true,
                'message' => 'Order marked as read',
                'order' => $order
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark as read',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function markAllAsRead(Request $request)
    {
        try {
            $unreadOrders = Order::where('read', false)->get();

            Order::where('read', false)->update([
                'read' => true,
                'read_at' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'All orders marked as read',
                'marked_count' => $unreadOrders->count()
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark all orders as read',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getUnreadCount()
    {
        try {
            $unreadCount = Order::where('read', false)->count();

            return response()->json([
                'success' => true,
                'unread_count' => $unreadCount
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get unread count',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    //User Order Cancel

    public function cancelOrder(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'reason' => 'required|string|max:500'
        ]);

        try {
            DB::beginTransaction();

            $order = Order::where('id', $request->order_id)
                ->where('user_id', Auth::id())
                ->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found or you are not authorized to cancel this order'
                ], 404);
            }

            $orderCreationTime = $order->created_at;
            $currentTime = now();
            $timeDifference = $currentTime->diffInMinutes($orderCreationTime);
            $maxCancellationTime = 60;

            if ($timeDifference > $maxCancellationTime) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order cannot be cancelled. Cancellation is only allowed within 1 hour of order placement.',
                    'time_elapsed' => $timeDifference . ' minutes',
                    'max_allowed' => $maxCancellationTime . ' minutes'
                ], 400);
            }

            $allowedStatuses = ['pending', 'contacted'];
            if (!in_array($order->status, $allowedStatuses)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order cannot be cancelled. It has already been ' . $order->status . '.',
                    'current_status' => $order->status,
                    'allowed_statuses' => $allowedStatuses
                ], 400);
            }

            $order->cancellation_reason = $request->reason;
            $order->cancelled_by = Auth::id();
            $order->cancelled_at = now();
            $order->status = 'cancelled';
            $order->save();

            $this->restoreProductStock($order);

            Log::info('Order cancelled by user', [
                'order_id' => $order->id,
                'order_code' => $order->order_code,
                'user_id' => Auth::id(),
                'reason' => $request->reason,
                'cancelled_at' => now()
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order cancelled successfully',
                'order' => $order->load('items'),
                'cancellation_details' => [
                    'reason' => $request->reason,
                    'cancelled_at' => $order->cancelled_at,
                    'time_elapsed' => $timeDifference . ' minutes'
                ]
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Order cancellation failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function restoreProductStock(Order $order)
    {
        try {
            $orderItems = OrderItem::where('order_id', $order->id)->get();

            foreach ($orderItems as $item) {
                $product = \App\Models\Product::find($item->product_id);

                if ($product) {
                    $product->availability += $item->quantity;
                    $product->save();

                    Log::info('Product stock restored after order cancellation', [
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'quantity_restored' => $item->quantity,
                        'new_availability' => $product->availability
                    ]);
                }
            }
        } catch (Exception $e) {
            Log::error('Failed to restore product stock: ' . $e->getMessage());
            throw $e;
        }
    }

    public function getCancellationEligibility($orderId)
    {
        try {
            $order = Order::where('id', $orderId)
                ->where('user_id', Auth::id())
                ->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found'
                ], 404);
            }

            $orderCreationTime = $order->created_at;
            $currentTime = now();
            $timeDifference = $currentTime->diffInMinutes($orderCreationTime);
            $maxCancellationTime = 60;

            $isWithinTimeLimit = $timeDifference <= $maxCancellationTime;
            $isAllowedStatus = in_array($order->status, ['pending', 'contacted']);
            $isEligible = $isWithinTimeLimit && $isAllowedStatus;

            $timeRemaining = $isWithinTimeLimit ? ($maxCancellationTime - $timeDifference) : 0;

            return response()->json([
                'success' => true,
                'is_eligible' => $isEligible,
                'order_details' => [
                    'order_code' => $order->order_code,
                    'status' => $order->status,
                    'created_at' => $order->created_at,
                    'total_amount' => $order->total_amount
                ],
                'cancellation_eligibility' => [
                    'is_within_time_limit' => $isWithinTimeLimit,
                    'is_allowed_status' => $isAllowedStatus,
                    'time_elapsed_minutes' => $timeDifference,
                    'max_cancellation_time_minutes' => $maxCancellationTime,
                    'time_remaining_minutes' => $timeRemaining,
                    'cancellation_deadline' => $orderCreationTime->addMinutes($maxCancellationTime)
                ],
                'reasons_required' => $isEligible
            ]);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to check cancellation eligibility',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
