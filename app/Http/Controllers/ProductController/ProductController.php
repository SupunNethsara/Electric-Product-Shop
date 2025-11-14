<?php

namespace App\Http\Controllers\ProductController;

use App\Http\Controllers\Controller;
use App\Http\Requests\ImageUploadRequest;
use App\Http\Requests\UploadProductRequest;
use App\Http\Requests\ValidateFilesRequest;
use App\Imports\ProductDetailsImport;
use App\Imports\ProductPricingImport;
use App\Models\Product;
use App\Models\ProductView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 15);
        $page = $request->get('page', 1);

        $query = Product::query();

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('item_code', 'like', "%{$search}%")
                    ->orWhere('model', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status != 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('min_price') && $request->min_price != '') {
            $query->where(function($q) use ($request) {
                $q->where('buy_now_price', '>=', $request->min_price)
                    ->orWhere('price', '>=', $request->min_price);
            });
        }

        if ($request->has('max_price') && $request->max_price != '') {
            $query->where(function($q) use ($request) {
                $q->where('buy_now_price', '<=', $request->max_price)
                    ->orWhere('price', '<=', $request->max_price);
            });
        }
        if ($request->has('in_stock') && $request->in_stock) {
            $query->where('availability', '>', 0);
        }
        $query->orderBy('created_at', 'desc');

        $products = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data' => $products->items(),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'last_page' => $products->lastPage(),
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
            ]
        ]);
    }
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:active,disabled'
        ]);

        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $product->status = $request->status;
        $product->save();

        return response()->json([
            'success' => true,
            'message' => 'Product status updated successfully',
            'data' => $product
        ]);
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

    public function uploadProducts(UploadProductRequest $request)
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
                        'category_2' => $detailRow[2] ?? $request->category_2, // Read from Excel or fallback to form
                        'category_3' => $detailRow[3] ?? $request->category_3, // Read from Excel or fallback to form
                        'name' => $detailRow[1] ?? 'No Name',
                        'model' => $detailRow[4] ?? '', // Updated index
                        'description' => $detailRow[5] ?? '', // Updated index
                        'hedding' => $detailRow[6] ?? null, // Updated index
                        'warranty' => $detailRow[7] ?? null, // Updated index
                        'specification' => $detailRow[8] ?? null, // Updated index
                        'tags' => $detailRow[9] ?? null, // Updated index
                        'youtube_video_id' => $detailRow[10] ?? null, // Updated index
                        'price' => $priceRow[1] ?? 0,
                        'buy_now_price' => $priceRow[3] ?? null,
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
    /**
     * Track product view
     */
    public function trackView(Request $request, $id)
    {
        try {
            $product = Product::find($id);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found'
                ], 404);
            }

            $user = null;
            if (auth('sanctum')->check()) {
                $user = auth('sanctum')->user();
            }
            $ipAddress = $request->ip();
            $userAgent = $request->userAgent();

            $recentView = ProductView::where('product_id', $id)
                ->where(function($query) use ($user, $ipAddress) {
                    if ($user) {
                        $query->where('user_id', $user->id);
                    } else {
                        $query->where('ip_address', $ipAddress);
                    }
                })
                ->where('created_at', '>=', now()->subHour())
                ->first();

            if (!$recentView) {
                $viewData = [
                    'product_id' => $id,
                    'ip_address' => $ipAddress,
                    'user_agent' => $userAgent,
                    'viewed_at' => now()
                ];

                if ($user) {
                    $viewData['user_id'] = $user->id;
                }
                $product->total_views++;
                $product->save();
                ProductView::create($viewData);
            }

            $product->refresh();

            return response()->json([
                'success' => true,
                'message' => 'View tracked successfully',
                'total_views' => $product->total_views,
                'user_authenticated' => !is_null($user)
            ]);

        } catch (\Exception $e) {
            \Log::error('Failed to track product view: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to track view',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Get product view statistics
     */
    public function getViewStats($id)
    {
        try {
            $product = Product::find($id);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found'
                ], 404);
            }

            $totalViews = $product->total_views;
            $todayViews = $product->views()->whereDate('viewed_at', today())->count();
            $last7DaysViews = $product->views()->where('viewed_at', '>=', now()->subDays(7))->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'total_views' => $totalViews,
                    'today_views' => $todayViews,
                    'last_7_days_views' => $last7DaysViews
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch view statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getMostViewedProducts()
    {
        $products = Product::with('category')
            ->where('total_views', '>', 0)
            ->orderBy('total_views', 'desc')
            ->limit(1)
            ->get();

        if ($products->isEmpty()) {
            return response()->json([
                'success' => true,
                'products' => [],
                'message' => 'No viewed products found'
            ]);
        }

        return response()->json([
            'success' => true,
            'products' => $products,
            'total_views' => $products->sum('total_views')
        ]);
    }

}
