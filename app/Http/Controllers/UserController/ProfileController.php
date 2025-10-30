<?php

namespace App\Http\Controllers\UserController;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $profile = $user->profile->with('user')->first();

        return response()->json([
            'profile' => $profile ? $profile->makeHidden('user_id') : null
        ]);
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
        ]);

        try {
            $user = auth()->user();
            $profileData = $request->except('profile_image');
            $profileData['user_id'] = $user->id;
            $profile = Profile::updateOrCreate(
                ['user_id' => $user->id],
                $profileData
            );
            $profile->load('user');
            return response()->json([
                'message' => 'Profile updated successfully!',
                'profile' => $profile->makeHidden('user_id')
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
