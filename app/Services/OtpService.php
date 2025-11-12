<?php

namespace App\Services;

use App\Models\OtpVerification;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OtpService
{
    protected $expiryMinutes = 10;
    protected $maxAttempts = 3;

    public function generateOtp($email, $type = 'registration')
    {
        try {
            DB::beginTransaction();

            OtpVerification::where('email', $email)
                ->where('type', $type)
                ->where('is_used', false)
                ->update(['is_used' => true]);

            $otp = OtpVerification::generateOtp();

            $otpVerification = OtpVerification::create([
                'email' => $email,
                'otp' => $otp,
                'type' => $type,
                'expires_at' => Carbon::now()->addMinutes($this->expiryMinutes),
            ]);

            DB::commit();

            return $otpVerification;

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('OTP Generation Error: ' . $e->getMessage());
            throw $e;
        }
    }

    public function verifyOtp($email, $otp, $type = 'registration')
    {
        $otpRecord = OtpVerification::where('email', $email)
            ->where('otp', $otp)
            ->where('type', $type)
            ->where('is_used', false)
            ->first();

        if (!$otpRecord) {
            return [
                'success' => false,
                'message' => 'Invalid OTP code'
            ];
        }

        if ($otpRecord->isExpired()) {
            $otpRecord->markAsUsed();
            return [
                'success' => false,
                'message' => 'OTP has expired'
            ];
        }

        if ($otpRecord->attempts >= $this->maxAttempts) {
            $otpRecord->markAsUsed();
            return [
                'success' => false,
                'message' => 'Too many attempts. Please request a new OTP'
            ];
        }

        $otpRecord->incrementAttempts();

        if ($otpRecord->otp !== $otp) {
            return [
                'success' => false,
                'message' => 'Invalid OTP code'
            ];
        }

        $otpRecord->markAsUsed();

        return [
            'success' => true,
            'message' => 'OTP verified successfully'
        ];
    }

    public function resendOtp($email, $type = 'registration')
    {
        $recentOtp = OtpVerification::where('email', $email)
            ->where('type', $type)
            ->where('is_used', false)
            ->where('expires_at', '>', Carbon::now())
            ->where('created_at', '>', Carbon::now()->subMinutes(1))
            ->first();

        if ($recentOtp) {
            return [
                'success' => false,
                'message' => 'Please wait before requesting a new OTP'
            ];
        }

        return $this->generateOtp($email, $type);
    }

    public function cleanupExpiredOtps()
    {
        return OtpVerification::where('expires_at', '<', Carbon::now())
            ->orWhere('is_used', true)
            ->delete();
    }
}
