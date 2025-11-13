<?php

namespace App\Http\Controllers\QuotationController;

use App\Http\Controllers\Controller;
use App\Models\Quotation;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class QuotationController extends Controller
{
    public function index()
    {
        $quotations = Quotation::with('product')
            ->where('user_id', auth()->id())
            ->get();

        return response()->json($quotations);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $product = Product::findOrFail($request->product_id);

        if ($product->availability < $request->quantity) {
            return response()->json([
                'message' => 'Requested quantity not available'
            ], 400);
        }

        DB::beginTransaction();
        try {
            $existingQuotation = Quotation::where('user_id', auth()->id())
                ->where('product_id', $request->product_id)
                ->first();

            if ($existingQuotation) {
                $existingQuotation->update([
                    'quantity' => $request->quantity
                ]);
                $quotation = $existingQuotation;
            } else {
                $quotation = Quotation::create([
                    'user_id' => auth()->id(),
                    'product_id' => $request->product_id,
                    'quantity' => $request->quantity
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Product added to quotations successfully',
                'item' => $quotation->load('product')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to add product to quotations'
            ], 500);
        }
    }

    public function destroy($id)
    {
        $quotation = Quotation::where('user_id', auth()->id())
            ->where('id', $id)
            ->first();

        if (!$quotation) {
            return response()->json([
                'message' => 'Quotation not found or already deleted'
            ], 200);
        }

        $quotation->delete();

        return response()->json([
            'message' => 'Item removed from quotations successfully'
        ]);
    }

    public function clear()
    {
        $deleted = Quotation::where('user_id', auth()->id())->delete();

        return response()->json([
            'message' => $deleted > 0
                ? 'All quotations cleared successfully'
                : 'No quotations to clear'
        ]);
    }
}
