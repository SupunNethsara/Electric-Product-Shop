<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'category_id', 'item_code', 'category_2' ,'category_3', 'name', 'model', 'hedding','warranty',
        'description', 'specification', 'tags', 'specification_pdf_id', 'total_views',
        'youtube_video_id', 'price', 'buy_now_price', 'availability', 'image', 'images', 'status'
    ];

    protected $casts = [
        'images' => 'array'
    ];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($product) {
            if (!empty($product->category_2) && empty($product->category_2_id)) {
                $category2 = Category::where('name', $product->category_2)->first();
                $product->category_2_id = $category2 ? $category2->id : null;
            }

            if (!empty($product->category_3) && empty($product->category_3_id)) {
                $category3 = Category::where('name', $product->category_3)->first();
                $product->category_3_id = $category3 ? $category3->id : null;
            }

            if (empty($product->category_id) && !empty($product->category_3_id)) {
                $product->category_id = $product->category_3_id;
            } elseif (empty($product->category_id) && !empty($product->category_2_id)) {
                $product->category_id = $product->category_2_id;
            }
        });
    }

    protected $appends = [
        'average_rating',
        'reviews_count',
        'rating_distribution',
        'total_views'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function views()
    {
        return $this->hasMany(ProductView::class);
    }

    public function getAverageRatingAttribute()
    {
        return $this->reviews()->avg('rating') ?: 0;
    }

    public function getReviewsCountAttribute()
    {
        return $this->reviews()->count();
    }

    public function getTotalViewsAttribute()
    {
        return $this->views()->count();
    }

    public function getRatingDistributionAttribute()
    {
        $distribution = $this->reviews()
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->orderBy('rating', 'desc')
            ->pluck('count', 'rating')
            ->toArray();

        $fullDistribution = [];
        for ($i = 5; $i >= 1; $i--) {
            $fullDistribution[$i] = $distribution[$i] ?? 0;
        }

        return $fullDistribution;
    }

    public function getUserReviewAttribute()
    {
        if (auth()->check()) {
            return $this->reviews()->where('user_id', auth()->id())->first();
        }
        return null;
    }
}
