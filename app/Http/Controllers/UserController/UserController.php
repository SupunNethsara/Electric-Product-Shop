<?php

namespace App\Http\Controllers\UserController;

use App\Http\Controllers\Controller;
use App\Mail\ContactConfirmationMail;
use App\Mail\ContactFormMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
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

    public function sendContactEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = [
                'name' => $request->name,
                'email' => $request->email,
                'subject' => $request->subject,
                'message_content' => $request->message,
                'inquiry_type' => $request->inquiry_type,
                'received_at' => now()->format('F j, Y \a\t g:i A')
            ];

            Mail::to('//owneremail')->send(new ContactFormMail($data));//click this

            Mail::to($data['email'])->send(new ContactConfirmationMail($data));//click this

            return response()->json([
                'success' => true,
                'message' => 'Email sent successfully'
            ]);

        } catch (\Exception $e) {
            \Log::error('Email sending failed: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to send email: ' . $e->getMessage()
            ], 500);
        }
    }

}
