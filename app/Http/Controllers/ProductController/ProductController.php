<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\ProductDetailsImport;
use App\Imports\ProductPricingImport;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function validateFiles(Request $request)
    {
        $request->validate([
            'details_file' => 'required|file|mimes:xlsx,csv',
            'pricing_file' => 'required|file|mimes:xlsx,csv',
        ]);

        $detailsImport = new ProductDetailsImport();
        $pricingImport = new ProductPricingImport();

        Excel::import($detailsImport, $request->file('details_file'));
        Excel::import($pricingImport, $request->file('pricing_file'));

        if ($detailsImport->errors || $pricingImport->errors) {
            return response()->json([
                'status' => 'failed',
                'details_errors' => $detailsImport->errors,
                'pricing_errors' => $pricingImport->errors,
            ], 422);
        }

        return response()->json(['status' => 'success', 'message' => 'Validation passed successfully!']);
    }

    public function uploadProducts(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'details_file' => 'required|file|mimes:xlsx,csv',
            'pricing_file' => 'required|file|mimes:xlsx,csv',
        ]);

        $details = Excel::toCollection(null, $request->file('details_file'))[0];
        $pricing = Excel::toCollection(null, $request->file('pricing_file'))[0];

        DB::transaction(function () use ($details, $pricing, $request) {
            foreach ($details as $detailRow) {
                $itemCode = $detailRow['item_code'];
                $priceRow = $pricing->firstWhere('item_code', $itemCode);

                if (!$priceRow) continue;

                Product::updateOrCreate(
                    ['item_code' => $itemCode],
                    [
                        'category_id' => $request->category_id,
                        'name' => $detailRow['name'],
                        'model' => $detailRow['model'] ?? '',
                        'description' => $detailRow['description'] ?? '',
                        'price' => $priceRow['price'],
                        'availability' => $priceRow['availability'],
                    ]
                );
            }
        });

        return response()->json(['message' => 'Products uploaded successfully!']);
    }

    public function uploadImages(Request $request)
    {
        $request->validate([
            'images.*' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        foreach ($request->file('images') as $image) {
            $filename = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
            $product = Product::where('item_code', $filename)->first();

            if ($product) {
                $path = $image->store('public/products');
                $product->update(['image' => basename($path)]);
            }
        }

        return response()->json(['message' => 'Images uploaded successfully!']);
    }
}
