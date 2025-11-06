<?php

namespace App\Http\Controllers\ReviewController;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    public function index(Request $request, $productId)
    {
        $request->validate([
            'per_page' => 'sometimes|integer|min:1|max:50',
            'page' => 'sometimes|integer|min:1',
            'rating' => 'sometimes|integer|min:1|max:5',
            'sort' => 'sometimes|in:newest,oldest,highest,lowest'
        ]);

        $perPage = $request->get('per_page', 10);
        $rating = $request->get('rating');
        $sort = $request->get('sort', 'newest');

        $product = Product::findOrFail($productId);

        $query = $product->reviews()->with('user:id,name');

        if ($rating) {
            $query->where('rating', $rating);
        }

        switch ($sort) {
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'highest':
                $query->orderBy('rating', 'desc');
                break;
            case 'lowest':
                $query->orderBy('rating', 'asc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $reviews = $query->paginate($perPage);

        return response()->json([
            'data' => $reviews->items(),
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
            ],
            'summary' => [
                'average_rating' => round($product->average_rating, 1),
                'total_reviews' => $product->reviews_count,
                'rating_distribution' => $product->rating_distribution
            ]
        ]);
    }

    public function store(StoreReviewRequest $request, $productId)
    {
        $product = Product::findOrFail($productId);

        $existingReview = Review::where('product_id', $productId)
            ->where('user_id', auth()->id())
            ->first();

        if ($existingReview) {
            return response()->json([
                'message' => 'You have already reviewed this product'
            ], 422);
        }

        try {
            DB::beginTransaction();

            $review = Review::create([
                'product_id' => $product->id,
                'user_id' => auth()->id(),
                'rating' => $request->rating,
                'comment' => $request->comment,
                'title' => $request->title,
                'is_verified' => false
            ]);

            DB::commit();

            $product->load('reviews');

            return response()->json([
                'message' => 'Review submitted successfully',
                'review' => $review,
                'summary' => [
                    'average_rating' => round($product->average_rating, 1),
                    'total_reviews' => $product->reviews_count
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to submit review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(StoreReviewRequest $request, $productId, $reviewId)
    {
        $review = Review::where('product_id', $productId)
            ->where('id', $reviewId)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        try {
            DB::beginTransaction();

            $review->update([
                'rating' => $request->rating,
                'comment' => $request->comment,
                'title' => $request->title
            ]);

            DB::commit();

            $product = Product::findOrFail($productId);

            return response()->json([
                'message' => 'Review updated successfully',
                'review' => $review,
                'summary' => [
                    'average_rating' => round($product->average_rating, 1),
                    'total_reviews' => $product->reviews_count
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($productId, $reviewId)
    {
        $review = Review::where('product_id', $productId)
            ->where('id', $reviewId)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        try {
            DB::beginTransaction();

            $review->delete();

            DB::commit();

            $product = Product::findOrFail($productId);

            return response()->json([
                'message' => 'Review deleted successfully',
                'summary' => [
                    'average_rating' => round($product->average_rating, 1),
                    'total_reviews' => $product->reviews_count
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to delete review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getProductRatingSummary($productId)
    {
        $product = Product::findOrFail($productId);

        return response()->json([
            'average_rating' => round($product->average_rating, 1),
            'total_reviews' => $product->reviews_count,
            'rating_distribution' => $product->rating_distribution
        ]);
    }
}
