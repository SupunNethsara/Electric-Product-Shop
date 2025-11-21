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
        'logo_url',
        'google_maps_embed',
        'admin_email',
        'contact_email',
        'business_hours',
        'social_links'
    ];

    protected $appends = ['logo_url'];

    protected $casts = [
        'social_links' => 'array',
        'items_per_page' => 'integer'
    ];

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

    /**
     * Get social links with default structure
     */
    public function getSocialLinksAttribute($value)
    {
        $defaultLinks = [
            'facebook' => '',
            'instagram' => '',
            'twitter' => '',
            'linkedin' => ''
        ];

        if ($value) {
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                return array_merge($defaultLinks, $decoded);
            }
        }

        return $defaultLinks;
    }

    /**
     * Set social links attribute
     */
    public function setSocialLinksAttribute($value)
    {
        if (is_array($value)) {
            $this->attributes['social_links'] = json_encode($value);
        } else {
            $this->attributes['social_links'] = $value;
        }
    }

    /**
     * Get business hours with fallback
     */
    public function getBusinessHoursAttribute($value)
    {
        if ($value) {
            return $value;
        }

        return "Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed";
    }

    /**
     * Get contact email with fallback to admin email
     */
    public function getContactEmailAttribute($value)
    {
        if ($value) {
            return $value;
        }

        return $this->admin_email;
    }
}
