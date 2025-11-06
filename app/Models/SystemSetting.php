<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class SystemSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'site_name',
        'admin_email',
        'mobile',
        'address',
        'site_description',
        'items_per_page',
        'logo',
        'logo_url'
    ];

    protected $appends = ['logo_url'];

    public function getLogoUrlAttribute($value)
    {
        if ($value) {
            return url($value);
        }

        if ($this->logo) {
            return url(Storage::url($this->logo));
        }

        return null;
    }

}
