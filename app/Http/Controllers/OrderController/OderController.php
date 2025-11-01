<?php

namespace App\Http\Controllers\OrderController;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OderController extends Controller
{
    public function getAllOrder()
    {
        return response()->json([
           'orders'=>Order::with('user')->get()
        ]);
    }

    public function getUserOrder(Request $request)
    {
        $orderCode = $request->input('order_code');
        $order = Order::with('user')->where('order_code', $orderCode)->first();

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
        ]);
    }


    public function directOrder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'total_amount' => 'required|numeric',
            'delivery_fee' => 'required|numeric',
            'delivery_option' => 'required|string',
        ]);

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

            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            DB::commit();
            return response()->json(['success' => true, 'order' => $order->load('items')], 201);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function cartCheckout(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'total_amount' => 'required|numeric',
            'delivery_fee' => 'required|numeric',
            'delivery_option' => 'required|string',
        ]);

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

            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            DB::commit();
            return response()->json(['success' => true, 'order' => $order->load('items')], 201);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

}
