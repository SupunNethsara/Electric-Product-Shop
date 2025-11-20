<?php

namespace App\Http\Controllers\AdminsController\BrandingController;

use App\Http\Controllers\Controller;
use App\Models\TopProduct;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
class TopProductController extends Controller
{
    public function index()
    {
        $products = TopProduct::orderBy('order')->get();
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:255',
            'price' => 'required|string',
            'original_price' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'button_text' => 'required|string|max:255',
            'theme_color' => 'required|in:primary,secondary',
            'is_active' => 'sometimes|boolean',
            'order' => 'integer'
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('top-products', 'public');
            $validated['image'] = Storage::disk('public')->url($imagePath);
        }

        $product = TopProduct::create($validated);
        return response()->json($product, Response::HTTP_CREATED);
    }

    public function show(TopProduct $topProduct)
    {
        return response()->json($topProduct);
    }

    public function update(Request $request, TopProduct $topProduct)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|string',
            'original_price' => 'nullable|string',
            'image' => 'sometimes|required',
            'button_text' => 'sometimes|required|string|max:255',
            'theme_color' => 'sometimes|required|in:primary,secondary',
            'is_active' => 'sometimes|boolean',
            'order' => 'integer'
        ]);

        if ($request->hasFile('image')) {
            $request->validate([
                'image' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048'
            ]);

            if ($topProduct->image && Storage::disk('public')->exists(str_replace('/storage/', '', $topProduct->image))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $topProduct->image));
            }

            $imagePath = $request->file('image')->store('top-products', 'public');
            $validated['image'] = Storage::disk('public')->url($imagePath);
        } else {
            $validated['image'] = $request->input('image');
        }

        $topProduct->update($validated);
        return response()->json($topProduct);
    }

    public function destroy(TopProduct $topProduct)
    {
        if ($topProduct->image && Storage::disk('public')->exists(str_replace('/storage/', '', $topProduct->image))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $topProduct->image));
        }

        $topProduct->delete();
        return response()->json(['message' => 'Top product deleted successfully']);
    }

    public function updateOrder(Request $request)
    {
        $request->validate([
            'products' => 'required|array',
            'products.*.id' => 'required|exists:top_products,id',
            'products.*.order' => 'required|integer'
        ]);

        foreach ($request->products as $productData) {
            TopProduct::where('id', $productData['id'])->update(['order' => $productData['order']]);
        }

        return response()->json(['message' => 'Order updated successfully']);
    }

    public function toggleStatus(TopProduct $topProduct)
    {
        $topProduct->update(['is_active' => !$topProduct->is_active]);
        return response()->json($topProduct);
    }
}
