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
            'logo' => 'nullable|mimes:png|max:2048'
        ]);

        $updateData = [
            'site_name' => $validated['siteName'],
            'admin_email' => $validated['adminEmail'],
            'mobile' => $validated['mobile'] ?? null,
            'address' => $validated['address'] ?? null,
            'site_description' => $validated['siteDescription'] ?? null,
            'items_per_page' => $validated['itemsPerPage'],
        ];

        if ($request->hasFile('logo')) {
            if ($settings->logo && Storage::exists($settings->logo)) {
                Storage::delete($settings->logo);
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
