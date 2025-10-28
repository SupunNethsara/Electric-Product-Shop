<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'phone',
        'address',
        'city',
        'postal_code',
        'country',
        'bio',
        'birth_date',
        'gender',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
