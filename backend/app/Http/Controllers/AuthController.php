<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use App\Models\User;
use App\Models\OtpVerification;
use Carbon\Carbon;

class AuthController extends Controller
{
    // ─── STEP 1: Send OTP ─────────────────────────────────────
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->email;

        // Check if email already registered
        if (User::where('email', $email)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'This email is already registered. Please login.',
            ], 409);
        }

        // Generate 6-digit OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Invalidate any previous OTPs for this email
        OtpVerification::where('email', $email)
            ->where('is_used', false)
            ->update(['is_used' => true]);

        // Save new OTP
        OtpVerification::create([
            'email'      => $email,
            'otp_code'   => $otp,
            'expires_at' => Carbon::now()->addMinutes(5),
            'is_used'    => false,
        ]);

        // Send OTP email
        Mail::raw("Your CDC Portal OTP is: $otp\n\nThis OTP expires in 5 minutes.", function ($message) use ($email) {
            $message->to($email)
                    ->subject('CDC Portal — Email Verification OTP');
        });

        return response()->json([
            'success' => true,
            'message' => 'OTP sent to your email.',
        ]);
    }

    // ─── STEP 2: Verify OTP ───────────────────────────────────
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'otp_code' => 'required|digits:6',
        ]);

        $otp = OtpVerification::where('email', $request->email)
            ->where('otp_code', $request->otp_code)
            ->where('is_used', false)
            ->where('expires_at', '>', Carbon::now())
            ->latest()
            ->first();

        if (!$otp) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired OTP.',
            ], 422);
        }

        // Mark OTP as used
        $otp->update(['is_used' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully.',
        ]);
    }

    // ─── STEP 3: Complete Registration ────────────────────────
    public function register(Request $request)
    {
        $request->validate([
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|email|unique:users,email',
            'password'              => 'required|min:8|confirmed',
            'password_confirmation' => 'required',
        ]);

        // Make sure email was OTP verified
        $verified = OtpVerification::where('email', $request->email)
            ->where('is_used', true)
            ->exists();

        if (!$verified) {
            return response()->json([
                'success' => false,
                'message' => 'Email not verified. Please verify OTP first.',
            ], 403);
        }

        $user = User::create([
            'name'               => $request->name,
            'email'              => $request->email,
            'role'               => 'recruiter',
            'password_hash'      => Hash::make($request->password),
            'email_verified_at'  => Carbon::now(),
            'is_active'          => true,
        ]);

        // Send Registration Confirmation Email
        $portalUrl = env('FRONTEND_URL', 'http://localhost:3000');
        Mail::send('emails.registration', [
            'email' => $request->email,
            'portal_url' => $portalUrl
        ], function ($message) use ($request) {
            $message->to($request->email)
                    ->subject('IIT (ISM) Dhanbad Recruitment Drive | Registration Confirmation');
        });

        $token = $user->createToken('cdc_portal')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Registration successful.',
            'token'   => $token,
            'user'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
            ],
        ], 201);
    }

    // ─── LOGIN ────────────────────────────────────────────────
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password_hash)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email or password.',
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been deactivated. Contact CDC.',
            ], 403);
        }

        // Revoke old tokens and create new one
        $user->tokens()->delete();
        $token = $user->createToken('cdc_portal')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful.',
            'token'   => $token,
            'user'    => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
            ],
        ]);
    }

    // ─── LOGOUT ───────────────────────────────────────────────
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
    }

    // ─── GET LOGGED IN USER ───────────────────────────────────
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'user'    => [
                'id'    => $request->user()->id,
                'name'  => $request->user()->name,
                'email' => $request->user()->email,
                'role'  => $request->user()->role,
            ],
        ]);
    }
}