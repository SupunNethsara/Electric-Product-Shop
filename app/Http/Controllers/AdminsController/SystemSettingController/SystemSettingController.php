<?php

namespace App\Http\Controllers\AdminsController\SystemSettingController;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;

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

        $settings->update([
            'site_name' => $request->siteName,
            'admin_email' => $request->adminEmail,
            'mobile' => $request->mobile,
            'address' => $request->address,
            'site_description' => $request->siteDescription,
            'items_per_page' => $request->itemsPerPage,
        ]);

        return response()->json([
            'message' => 'Settings updated successfully!',
            'data' => $settings
        ]);
    }
}
