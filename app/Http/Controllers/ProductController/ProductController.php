<?php

namespace App\Http\Controllers\ProductController;

use App\Http\Controllers\Controller;
use App\Imports\ProductDetailsImport;
use App\Imports\ProductPricingImport;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

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

        $details = Excel::toArray([], $request->file('details_file'))[0];
        $pricing = Excel::toArray([], $request->file('pricing_file'))[0];

        array_shift($details);
        array_shift($pricing);

        DB::transaction(function () use ($details, $pricing, $request) {
            foreach ($details as $detailRow) {
                if (empty($detailRow[0])) continue;
                $itemCode = $detailRow[0];

                $priceRow = collect($pricing)->first(function($row) use ($itemCode) {
                    return !empty($row[0]) && $row[0] === $itemCode;
                });

                if (!$priceRow) continue;

                Product::updateOrCreate(
                    ['item_code' => $itemCode],
                    [
                        'category_id' => $request->category_id,
                        'name' => $detailRow[1] ?? 'No Name',
                        'model' => $detailRow[2] ?? '',
                        'description' => $detailRow[3] ?? '',
                        'price' => $priceRow[1] ?? 0,
                        'availability' => $priceRow[2] ?? 0,
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
                $uploadedFile = cloudinary()->upload(
                    $image->getRealPath(),
                    [
                        'folder' => 'products',
                        'public_id' => $filename,
                        'overwrite' => true,
                    ]
                );
                $imageUrl = $uploadedFile->getSecurePath();

                $product->update(['image' => $imageUrl]);
            }
        }

        return response()->json(['message' => 'Images uploaded to Cloudinary successfully!']);
    }

}
