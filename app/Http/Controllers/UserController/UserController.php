<?php

namespace App\Http\Controllers\UserController;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    public function getAllUsers()
    {
        try {
            $users = User::with('profile')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'users' => $users
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch users',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
