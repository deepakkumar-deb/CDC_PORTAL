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
            'designation'           => 'nullable|string|max:255',
            'std_code'              => 'nullable|string|max:5',
            'phone'                 => 'nullable|string|max:15',
        ]);

        // Make sure email was OTP verified
        $verified = OtpVerification::where('email', $request->email)
            ->where('is_used', true)
            ->latest()
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
            'designation'        => $request->designation,
            'std_code'           => $request->std_code,
            'phone'              => $request->phone,
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
                'id'          => $user->id,
                'name'        => $user->name,
                'email'       => $user->email,
                'role'        => $user->role,
                'designation' => $user->designation,
                'std_code'    => $user->std_code,
                'phone'       => $user->phone,
                'profile_picture' => $user->profile_picture,
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
                'id'          => $user->id,
                'name'        => $user->name,
                'email'       => $user->email,
                'role'        => $user->role,
                'designation' => $user->designation,
                'std_code'    => $user->std_code,
                'phone'       => $user->phone,
                'profile_picture' => $user->profile_picture,
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
        $user = $request->user();
        return response()->json([
            'success' => true,
            'user'    => [
                'id'          => $user->id,
                'name'        => $user->name,
                'email'       => $user->email,
                'role'        => $user->role,
                'designation' => $user->designation,
                'std_code'    => $user->std_code,
                'phone'       => $user->phone,
                'profile_picture' => $user->profile_picture,
            ],
        ]);
    }

    // ─── FORGOT PASSWORD: SEND OTP ─────────────────────────────
    public function sendResetOtp(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $email = $request->email;
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        OtpVerification::where('email', $email)->where('is_used', false)->update(['is_used' => true]);

        OtpVerification::create([
            'email'      => $email,
            'otp_code'   => $otp,
            'expires_at' => Carbon::now()->addMinutes(10),
            'is_used'    => false,
        ]);

        Mail::raw("Your CDC Portal Password Reset OTP is: $otp\n\nThis OTP expires in 10 minutes.", function ($message) use ($email) {
            $message->to($email)->subject('CDC Portal — Password Reset OTP');
        });

        return response()->json(['success' => true, 'message' => 'OTP sent to your email.']);
    }

    // ─── FORGOT PASSWORD: RESET ────────────────────────────────
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'otp_code' => 'required|digits:6',
            'password' => 'required|min:8|confirmed',
        ]);

        $otp = OtpVerification::where('email', $request->email)
            ->where('otp_code', $request->otp_code)
            ->where('is_used', false)
            ->where('expires_at', '>', Carbon::now())
            ->latest()
            ->first();

        if (!$otp) {
            return response()->json(['success' => false, 'message' => 'Invalid or expired OTP.'], 422);
        }

        $user = User::where('email', $request->email)->first();
        $user->update(['password_hash' => Hash::make($request->password)]);
        $otp->update(['is_used' => true]);

        return response()->json(['success' => true, 'message' => 'Password reset successfully.']);
    }

    // ─── UPDATE PROFILE ────────────────────────────────────────
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        $request->validate([
            'name'        => 'required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'std_code'    => 'nullable|string|max:5',
            'phone'       => 'nullable|string|max:15',
        ]);

        $user->update([
            'name'        => $request->name,
            'designation' => $request->designation,
            'std_code'    => $request->std_code,
            'phone'       => $request->phone,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'user'    => [
                'id'          => $user->id,
                'name'        => $user->name,
                'email'       => $user->email,
                'role'        => $user->role,
                'designation' => $user->designation,
                'std_code'    => $user->std_code,
                'phone'       => $user->phone,
                'profile_picture' => $user->profile_picture,
            ],
        ]);
    }

    // ─── UPLOAD PROFILE PICTURE ────────────────────────────────
    public function uploadProfilePicture(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . $file->getClientOriginalName();
            
            // Create directory if not exists
            if (!file_exists(public_path('storage/profiles'))) {
                mkdir(public_path('storage/profiles'), 0777, true);
            }

            $file->move(public_path('storage/profiles'), $filename);
            
            $path = '/storage/profiles/' . $filename;
            $user->update(['profile_picture' => $path]);

            return response()->json([
                'success' => true,
                'message' => 'Profile picture updated.',
                'path'    => $path,
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded.'], 400);
    }
}