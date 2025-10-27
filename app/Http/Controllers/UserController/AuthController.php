<?php

namespace App\Http\Controllers\UserController;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
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
    public function redirectToGoogle()
    {
        return Socialite::driver('google')
            ->redirectUrl(config('services.google.redirect')) // Use config
            ->stateless()
            ->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            \Log::info('Google OAuth Callback Started');

            // Disable SSL verification for local development
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

            // Get the frontend URL from config
            $frontendUrl = rtrim(config('services.frontend_url'), '/');

            // Redirect to the React route that actually exists
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
