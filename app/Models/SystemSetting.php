<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    protected $fillable = [
        'site_name',
        'admin_email',
        'mobile',
        'address',
        'site_description',
        'items_per_page',
    ];
}
