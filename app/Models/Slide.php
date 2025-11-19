<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slide extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'price',
        'original_price',
        'image',
        'theme_colors',
        'is_active',
        'order'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'theme_colors' => 'array'
    ];
}
