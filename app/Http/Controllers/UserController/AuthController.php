<?php

namespace App\Http\Controllers\UserController;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRegisterRequest;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function register(UserRegisterRequest $request)
    {
        $request->validated();

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'user',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }
        if ($user->status !== 'active') {
            return response()->json([
                'message' => 'Your account is inactive. Please contact an administrator.',
            ], 403);
        }
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User logged in successfully',
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'User logged out successfully',
        ]);
    }
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        try {
            $status = Password::sendResetLink(
                $request->only('email')
            );

            \Log::info('Password reset link requested for: ' . $request->email);

            if ($status === Password::RESET_LINK_SENT) {
                return response()->json([
                    'message' => 'Password reset link sent to your email',
                    'status' => true
                ], 200);
            }

            return response()->json([
                'message' => 'Unable to send reset link. Please try again.',
                'status' => false
            ], 400);

        } catch (\Exception $e) {
            \Log::error('Password reset error: ' . $e->getMessage());

            return response()->json([
                'message' => 'Unable to send reset link. Please try again later.',
                'status' => false
            ], 500);
        }
    }

    /**
     * Reset password
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'status' => false
            ], 422);
        }

        try {
            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function (User $user, string $password) {
                    $user->forceFill([
                        'password' => Hash::make($password)
                    ])->setRememberToken(Str::random(60));

                    $user->save();

                    event(new PasswordReset($user));

                    \Log::info('Password reset successful for user: ' . $user->email);
                }
            );

            if ($status === Password::PASSWORD_RESET) {
                return response()->json([
                    'message' => 'Password reset successfully',
                    'status' => true
                ], 200);
            }

            return response()->json([
                'message' => 'Invalid or expired reset token',
                'status' => false
            ], 400);

        } catch (\Exception $e) {
            \Log::error('Password reset error: ' . $e->getMessage());

            return response()->json([
                'message' => 'Unable to reset password. Please try again.',
                'status' => false
            ], 500);
        }
    }

    /**
     * Verify reset token
     */
    public function verifyResetToken(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
        ]);

        $tokenData = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$tokenData) {
            return response()->json([
                'message' => 'Invalid or expired reset token',
                'status' => false
            ], 400);
        }

        if (!Hash::check($request->token, $tokenData->token)) {
            return response()->json([
                'message' => 'Invalid reset token',
                'status' => false
            ], 400);
        }

        $createdAt = Carbon::parse($tokenData->created_at);
        if ($createdAt->diffInMinutes(Carbon::now()) > 60) {
            DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->delete();

            return response()->json([
                'message' => 'Reset token has expired',
                'status' => false
            ], 400);
        }

        return response()->json([
            'message' => 'Token is valid',
            'status' => true
        ], 200);
    }
    public function redirectToGoogle()
    {
        return Socialit::driver('google')
            ->redirectUrl(config('services.google.redirect'))
            ->stateless()
            ->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            \Log::info('Google OAuth Callback Started');

            $httpClient = new \GuzzleHttp\Client([
                'verify' => false,
            ]);

            \Laravel\Socialite\Facades\Socialite::driver('google')->setHttpClient($httpClient);

            $googleUser = Socialite::driver('google')
                ->redirectUrl(config('services.google.redirect'))
                ->stateless()
                ->user();

            \Log::info('Google User Retrieved:', [
                'email' => $googleUser->getEmail(),
                'name' => $googleUser->getName(),
                'id' => $googleUser->getId()
            ]);

            $user = User::firstOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName(),
                    'password' => Hash::make(Str::random(24)),
                    'email_verified_at' => now(),
                ]
            );

            \Log::info('User processed:', ['user_id' => $user->id]);

            $token = $user->createToken('auth_token')->plainTextToken;
            $frontendUrl = rtrim(config('services.frontend_url'), '/');

            $redirectUrl = $frontendUrl . '/auth/google/callback' .
                '?token=' . $token .
                '&user=' . urlencode(json_encode($user));

            return redirect()->away($redirectUrl);

        } catch (\Exception $e) {
            \Log::error('Google OAuth Error Details:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect(config('services.frontend_url') . '/login?error=google_auth_failed&message=' . urlencode($e->getMessage()));
        }
    }
}
