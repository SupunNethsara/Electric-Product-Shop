<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OtpVerification extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'email',
        'otp',
        'type',
        'expires_at',
        'is_used',
        'attempts'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'is_used' => 'boolean',
    ];

    public function isExpired()
    {
        return $this->expires_at->isPast();
    }

    public function markAsUsed()
    {
        $this->update(['is_used' => true]);
    }

    public function incrementAttempts()
    {
        $this->increment('attempts');
    }

    public static function generateOtp()
    {
        return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }
}
