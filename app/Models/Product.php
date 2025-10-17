<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'item_code', 'name', 'model',
        'description', 'price', 'availability', 'image'
    ];

    public function category() {
        return $this->belongsTo(Category::class);
    }
}
