<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// ── Public routes (no login needed) ──────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/send-otp',  [AuthController::class, 'sendOtp']);
    Route::post('/verify-otp',[AuthController::class, 'verifyOtp']);
    Route::post('/register',  [AuthController::class, 'register']);
    Route::post('/login',     [AuthController::class, 'login']);
});

// ── Protected routes (must be logged in) ─────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);
});