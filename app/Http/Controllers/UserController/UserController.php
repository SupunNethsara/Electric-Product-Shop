<?php

namespace App\Http\Controllers\UserController;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    public function getAllUsers()
    {
        try {
            $users = User::with(['profile' => function($query) {
                $query->select('id', 'user_id', 'phone', 'address', 'city', 'postal_code', 'country', 'bio', 'birth_date', 'gender');
            }])
                ->select('id', 'name', 'email', 'role', 'status', 'email_verified_at', 'created_at', 'updated_at')->where('role', 'user')
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
    public function toggleUserStatus($id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'message' => 'User not found'
                ], 404);
            }

            $user->status = $user->status === 'active' ? 'deactive' : 'active';
            $user->save();

            return response()->json([
                'message' => 'User status updated successfully',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => $user->status,
                    'created_at' => $user->created_at,
                    'profile' => $user->profile
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update user status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getAllUsersToSuperAdmin()
    {
        try {
            $users = User::with(['profile' => function($query) {
                $query->select('id', 'user_id', 'phone', 'address', 'city', 'postal_code', 'country', 'bio', 'birth_date', 'gender');
            }])
                ->select('id', 'name', 'email', 'role', 'status', 'email_verified_at', 'created_at', 'updated_at')
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
