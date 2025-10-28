<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{public function index(Request $request)
    {
        $cartItems = Cart::with('product')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($cartItems);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
        ]);

        $product = Product::find($data['product_id']);

        if ($product->availability < $data['quantity']) {
            return response()->json(['message' => 'Not enough stock'], 422);
        }
        $cartItem = Cart::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'product_id' => $data['product_id']
            ],
            [
                'quantity' => $data['quantity']
            ]
        );

        return response()->json([
            'message' => 'Added to cart successfully',
            'item' => $cartItem->load('product')
        ]);
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate(['quantity' => 'required|integer|min:1']);
        $cartItem = Cart::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $product = Product::find($cartItem->product_id);
        if ($product->availability < $data['quantity']) {
            return response()->json(['message' => 'Not enough stock'], 422);
        }

        $cartItem->update(['quantity' => $data['quantity']]);
        return response()->json(['message' => 'Cart updated', 'item' => $cartItem]);
    }


    public function destroy(Request $request, $id)
    {
        $cartItem = Cart::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$cartItem) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $cartItem->delete();
        return response()->json(['message' => 'Item removed from cart']);
    }
}
