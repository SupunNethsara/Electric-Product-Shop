<?php
// app/Models/Slide.php

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
        'background_gradient',
        'gradient_from',
        'gradient_via',
        'gradient_to',
        'text_color',
        'button_color',
        'button_text_color',
        'badge_text',
        'badge_color',
        'promotion_text',
        'call_to_action',
        'is_active',
        'order'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];
}
