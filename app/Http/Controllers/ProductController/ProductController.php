<?php

namespace App\Http\Controllers\ProductController;

use App\Http\Controllers\Controller;
use App\Http\Requests\ImageUploadRequest;
use App\Http\Requests\UploadProudctRequest;
use App\Http\Requests\ValidateFilesRequest;
use App\Imports\ProductDetailsImport;
use App\Imports\ProductPricingImport;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::all();
        return response()->json($products);
    }
    public function getActiveProducts(Request $request)
    {
        $perPage = $request->get('per_page', 20);
        $page = $request->get('page', 1);
        $searchQuery = $request->get('search', '');
        $categories = $request->get('categories', []);
        $minPrice = $request->get('min_price', 0);
        $maxPrice = $request->get('max_price', 300000);
        $availability = $request->get('availability', 'all');
        $sortBy = $request->get('sort_by', 'featured');

        $query = Product::where('status', 'active');

        if (!empty($searchQuery)) {
            $query->where(function($q) use ($searchQuery) {
                $q->where('name', 'like', "%{$searchQuery}%")
                    ->orWhere('description', 'like', "%{$searchQuery}%");
            });
        }

        if (!empty($categories)) {
            if (is_string($categories)) {
                $categories = explode(',', $categories);
            }
            $query->whereIn('category_id', $categories);
        }

        $query->whereBetween('price', [$minPrice, $maxPrice]);

        if ($availability === 'in-stock') {
            $query->where('availability', '>', 0);
        } elseif ($availability === 'out-of-stock') {
            $query->where('availability', 0);
        }

        switch ($sortBy) {
            case 'price-low':
                $query->orderBy('price', 'asc');
                break;
            case 'price-high':
                $query->orderBy('price', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating', 'desc');
                break;
            case 'name':
                $query->orderBy('name', 'asc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $products = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data' => $products->items(),
            'meta' => [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
            ]
        ]);
    }
    public function homeProducts(){
        $products = Product::where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->take(15)
            ->get();

        return response()->json($products);
    }
    public function validateFiles(ValidateFilesRequest $request)
    {
        $request->validated();

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

    public function uploadProducts(UploadProudctRequest $request)
    {
        $request->validated();

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

    public function uploadImages(ImageUploadRequest $request)
    {
        try {
          $request->validated();
            $product = Product::find($request->product_id);

            if (!$product) {
                return response()->json([
                    'message' => 'Product not found',
                    'errors' => [
                        'product_id' => ['The selected product was not found. It may have been deleted.']
                    ]
                ], 404);
            }

            $product->images = json_encode($request->image_urls);
            $mainImageIndex = $request->main_image_index ?? 0;
            $product->image = $request->image_urls[$mainImageIndex];

            $product->status = 'active';
            $product->save();

            return response()->json([
                'message' => 'Images uploaded successfully!',
                'main_image' => $product->image,
                'all_images' => $request->image_urls
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Failed to upload images',
                'error' => $e->getMessage()
            ], 500);
        }
    }


}
