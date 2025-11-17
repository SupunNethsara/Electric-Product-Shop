<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'item_code', 'name', 'category_1', 'category_2', 'category_3', 'model', 'hedding', 'warranty',
        'description', 'specification', 'tags', 'specification_pdf_id','youtube_video_id',
        'price', 'buy_now_price', 'availability', 'image', 'images', 'status'
    ];

    protected $casts = [
        'images' => 'array'
    ];


    protected $appends = [
        'average_rating',
        'reviews_count',
        'rating_distribution',

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
