<?php

namespace App\Http\Controllers\UserController;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index()
    {
        return response()->json(['profile' => auth()->user()->profile]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'bio' => 'nullable|string|max:500',
            'birth_date' => 'nullable|date',
            'gender' => 'nullable|string|in:Male,Female,Other',
            'profile_image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);
        $validated['user_id'] = auth()->id();
        $profile = Profile::updateOrCreate(
            ['user_id' => auth()->id()],
            $validated
        );
        return response()->json([
            'message' => 'Profile saved successfully!',
            'profile' => $profile
        ]);
    }
}
