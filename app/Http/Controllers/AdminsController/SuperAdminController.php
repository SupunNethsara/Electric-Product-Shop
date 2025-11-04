<?php

namespace App\Http\Controllers\AdminsController;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SuperAdminController extends Controller
{
    function index()
    {
        $admins = User::whereIn('role', ['admin', 'super_admin'])
            ->select('id', 'name', 'email', 'role', 'status', 'created_at', 'updated_at')
            ->get();

        return response()->json([
            'message' => 'Admins fetched successfully',
            'admins' => $admins,
        ]);
    }

    function addAdmins(Request $request)
    {
        Log::info($request->all());
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:admin,super_admin',
            'status' => 'required|string|in:active,inactive'
        ]);

        $user = $request->user();

        if (!$user || $user->role !== 'super_admin') {
            return response()->json(['message' => 'Access denied. SuperAdmin only.'], 403);
        }

        $admin = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => $request->status,
        ]);

        $admin->refresh();

        return response()->json([
            'success' => true,
            'message' => 'Admin created successfully',
            'admin' => $admin,
        ], 201);
    }

    function updateAdmin(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'role' => 'required|string|in:admin,super_admin',
            'status' => 'required|string|in:active,inactive',
            'password' => 'nullable|string|min:8|confirmed'
        ]);

        $user = $request->user();

        if (!$user || $user->role !== 'super_admin') {
            return response()->json(['message' => 'Access denied. SuperAdmin only.'], 403);
        }

        $admin = User::whereIn('role', ['admin', 'super_admin'])->find($id);

        if (!$admin) {
            return response()->json(['message' => 'Admin not found'], 404);
        }

        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'status' => $request->status,
        ];

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $admin->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Admin updated successfully',
            'admin' => $admin,
        ]);
    }
    
    function deleteAdmin(Request $request, $id)
    {
        $user = $request->user();

        if (!$user || $user->role !== 'super_admin') {
            return response()->json(['message' => 'Access denied. SuperAdmin only.'], 403);
        }

        $admin = User::whereIn('role', ['admin', 'super_admin'])->find($id);

        if (!$admin) {
            return response()->json(['message' => 'Admin not found'], 404);
        }

        $admin->delete();

        return response()->json([
            'success' => true,
            'message' => 'Admin deleted successfully',
        ]);
    }
}
