<?php

namespace App\Http\Controllers\ProductController;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
class WishlistController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $user = Auth::user();

            $wishlistItems = Wishlist::with(['product' => function($query) {
                $query->select('id', 'name', 'image', 'price', 'buy_now_price', 'availability');
            }])
                ->where('user_id', $user->id)
                ->latest()
                ->get()
                ->map(function($item) {
                    return [
                        'id' => $item->id,
                        'product' => [
                            'id' => $item->product->id,
                            'name' => $item->product->name,
                            'image' => $item->product->image,
                            'price' => $item->product->price,
                            'buy_now_price' => $item->product->buy_now_price,
                            'original_price' => $item->product->price,
                            'availability' => $item->product->availability,
                            'category' => $item->product->category->name ?? 'Uncategorized',
                        ],
                        'added_at' => $item->created_at->format('Y-m-d H:i:s'),
                    ];
                });

            return response()->json([
                'status' => 'success',
                'message' => 'Wishlist retrieved successfully',
                'items' => $wishlistItems,
                'count' => $wishlistItems->count(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve wishlist',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Add product to wishlist
     */
    public function addToWishlist(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'product_id' => 'required|exists:products,id',
            ]);

            $user = Auth::user();
            $productId = $request->product_id;

            // Check if product already in wishlist
            $existingWishlistItem = Wishlist::where('user_id', $user->id)
                ->where('product_id', $productId)
                ->first();

            if ($existingWishlistItem) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Product is already in your wishlist',
                ], 409);
            }

            // Add to wishlist
            $wishlistItem = Wishlist::create([
                'user_id' => $user->id,
                'product_id' => $productId,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Product added to wishlist successfully',
                'wishlist_item' => $wishlistItem,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to add product to wishlist',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove product from wishlist
     */
    public function removeFromWishlist($productId): JsonResponse
    {
        try {
            $user = Auth::user();

            $wishlistItem = Wishlist::where('user_id', $user->id)
                ->where('product_id', $productId)
                ->first();

            if (!$wishlistItem) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Product not found in your wishlist',
                ], 404);
            }

            $wishlistItem->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Product removed from wishlist successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to remove product from wishlist',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Check if product is in user's wishlist
     */
    public function checkWishlistStatus($productId): JsonResponse
    {
        try {
            $user = Auth::user();

            $isInWishlist = Wishlist::where('user_id', $user->id)
                ->where('product_id', $productId)
                ->exists();

            return response()->json([
                'status' => 'success',
                'is_in_wishlist' => $isInWishlist,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to check wishlist status',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Move all wishlist items to cart
     */
    public function moveAllToCart(): JsonResponse
    {
        try {
            $user = Auth::user();

            $wishlistItems = Wishlist::with('product')
                ->where('user_id', $user->id)
                ->get();

            if ($wishlistItems->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Your wishlist is empty',
                ], 404);
            }

            $movedCount = 0;
            $failedCount = 0;

            foreach ($wishlistItems as $wishlistItem) {
                try {
                    // Check if product is available
                    if ($wishlistItem->product->availability > 0) {
                        // Add to cart (you'll need to implement your cart logic here)
                        $this->addToCart($user->id, $wishlistItem->product_id, 1);

                        // Remove from wishlist
                        $wishlistItem->delete();
                        $movedCount++;
                    } else {
                        $failedCount++;
                    }
                } catch (\Exception $e) {
                    $failedCount++;
                    // Continue with other items even if one fails
                    continue;
                }
            }

            return response()->json([
                'status' => 'success',
                'message' => "Successfully moved {$movedCount} items to cart" . ($failedCount > 0 ? ", {$failedCount} items failed" : ""),
                'moved_count' => $movedCount,
                'failed_count' => $failedCount,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to move items to cart',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Clear entire wishlist
     */
    public function clearWishlist(): JsonResponse
    {
        try {
            $user = Auth::user();

            $deletedCount = Wishlist::where('user_id', $user->id)->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Wishlist cleared successfully',
                'deleted_count' => $deletedCount,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to clear wishlist',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get wishlist count
     */
    public function getWishlistCount(): JsonResponse
    {
        try {
            $user = Auth::user();

            $count = Wishlist::where('user_id', $user->id)->count();

            return response()->json([
                'status' => 'success',
                'count' => $count,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to get wishlist count',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Helper method to add product to cart
     * You should replace this with your actual cart implementation
     */
    private function addToCart($userId, $productId, $quantity)
    {
        $existingCartItem = Cart::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($existingCartItem) {
            $existingCartItem->increment('quantity', $quantity);
        } else {
            Cart::create([
                'user_id' => $userId,
                'product_id' => $productId,
                'quantity' => $quantity,
            ]);
        }

        return true;
    }

}
