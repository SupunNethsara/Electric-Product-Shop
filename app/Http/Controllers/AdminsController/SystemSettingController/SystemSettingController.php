<?php
namespace App\Http\Controllers\AdminsController\SystemSettingController;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SystemSettingController extends Controller
{
    public function index()
    {
        $settings = SystemSetting::first();

        if (!$settings) {
            $settings = SystemSetting::create();
        }

        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $settings = SystemSetting::first();

        if (!$settings) {
            $settings = SystemSetting::create();
        }

        $validated = $request->validate([
            'siteName' => 'required|string|max:255',
            'adminEmail' => 'required|email|max:255',
            'mobile' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'siteDescription' => 'nullable|string',
            'itemsPerPage' => 'required|integer|min:1|max:100',
            'logo' => 'nullable|mimes:png|max:2048',
            'googleMapsEmbed' => 'nullable|string',
            'contactEmail' => 'nullable|email|max:255',
            'businessHours' => 'nullable|string',
            'socialLinks' => 'nullable|json'
        ]);

        $updateData = [
            'site_name' => $validated['siteName'],
            'admin_email' => $validated['adminEmail'],
            'mobile' => $validated['mobile'] ?? null,
            'address' => $validated['address'] ?? null,
            'site_description' => $validated['siteDescription'] ?? null,
            'items_per_page' => $validated['itemsPerPage'],
            'google_maps_embed' => $validated['googleMapsEmbed'] ?? null,
            'contact_email' => $validated['contactEmail'] ?? null,
            'business_hours' => $validated['businessHours'] ?? null,
        ];

        // Handle social links
        if ($request->has('socialLinks')) {
            $socialLinks = json_decode($request->input('socialLinks'), true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $updateData['social_links'] = $socialLinks;
            }
        }

        $shouldRemoveLogo = $request->has('remove_logo') && $request->input('remove_logo') === 'true';

        if ($shouldRemoveLogo) {
            if ($settings->logo && Storage::disk('public')->exists($settings->logo)) {
                Storage::disk('public')->delete($settings->logo);
            }
            $updateData['logo'] = null;
            $updateData['logo_url'] = null;
        }
        else if ($request->hasFile('logo')) {
            if ($settings->logo && Storage::disk('public')->exists($settings->logo)) {
                Storage::disk('public')->delete($settings->logo);
            }

            $logoPath = $request->file('logo')->store('logos', 'public');
            $updateData['logo'] = $logoPath;
            $updateData['logo_url'] = Storage::url($logoPath);
        }

        $settings->update($updateData);

        return response()->json([
            'message' => 'Settings updated successfully!',
            'data' => $settings
        ]);
    }
}
