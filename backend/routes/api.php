<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\JnfController;
use App\Http\Controllers\InfController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ExtractionController;
use App\Http\Controllers\MetadataController;
use App\Http\Middleware\AdminMiddleware;

// ── Public routes (no login needed) ──────────────────────────
Route::get('/metadata/programs', [MetadataController::class, 'programs']);

Route::prefix('auth')->group(function () {
    Route::post('/send-otp',  [AuthController::class, 'sendOtp']);
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('/register',  [AuthController::class, 'register']);
    Route::post('/login',     [AuthController::class, 'login']);
});

// ── Protected routes (must be logged in) ─────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // ── Auth ──────────────────────────────────────────────────
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // ── Company ───────────────────────────────────────────────
    Route::get('/company',        [CompanyController::class, 'show']);
    Route::post('/company',        [CompanyController::class, 'store']);
    Route::post('/company/update', [CompanyController::class, 'update']);

    // ── Extraction (PDF Autofill) ─────────────────────────────
    Route::post('/extract-pdf',   [ExtractionController::class, 'extract']);

    // ── JNF ───────────────────────────────────────────────────
    Route::get('/jnf',                       [JnfController::class, 'index']);
    Route::post('/jnf',                       [JnfController::class, 'store']);
    Route::get('/jnf/{id}',                  [JnfController::class, 'show']);
    Route::post('/jnf/{id}/job-details',      [JnfController::class, 'saveJobDetails']);
    Route::post('/jnf/{id}/eligibility',      [JnfController::class, 'saveEligibility']);
    Route::post('/jnf/{id}/salary',           [JnfController::class, 'saveSalary']);
    Route::post('/jnf/{id}/selection',        [JnfController::class, 'saveSelection']);
    Route::post('/jnf/{id}/submit',           [JnfController::class, 'submit']);
    Route::post('/jnf/{id}/request-edit',     [JnfController::class, 'requestEdit']);
    Route::post('/jnf/{id}/duplicate', [JnfController::class, 'duplicate']);
    Route::delete('/jnf/{id}',                 [JnfController::class, 'destroy']);

    // ── INF ───────────────────────────────────────────────────
    Route::get('/inf',                       [InfController::class, 'index']);
    Route::post('/inf',                       [InfController::class, 'store']);
    Route::get('/inf/{id}',                  [InfController::class, 'show']);
    Route::post('/inf/{id}/intern-profile',   [InfController::class, 'saveInternProfile']);
    Route::post('/inf/{id}/eligibility',      [InfController::class, 'saveEligibility']);
    Route::post('/inf/{id}/stipend',          [InfController::class, 'saveStipend']);
    Route::post('/inf/{id}/selection',        [InfController::class, 'saveSelection']);
    Route::post('/inf/{id}/submit',           [InfController::class, 'submit']);
    Route::post('/inf/{id}/request-edit',     [InfController::class, 'requestEdit']);
    Route::delete('/inf/{id}',                 [InfController::class, 'destroy']);
    // Route::post('/inf/{id}/duplicate', [JnfController::class, 'duplicate']);
});


//Admin Routes
Route::middleware(['auth:sanctum', AdminMiddleware::class])->prefix('admin')->group(function () {
    Route::get('/stats',          [AdminController::class, 'stats']);
    Route::get('/forms',          [AdminController::class, 'listForms']);
    Route::get('/forms/{id}',     [AdminController::class, 'showForm']);
    Route::post('/forms/{id}/approve', [AdminController::class, 'approve']);
    Route::post('/forms/{id}/reject',  [AdminController::class, 'reject']);
    Route::post('/forms/{id}/allow-edit', [AdminController::class, 'allowEdit']);
    Route::post('/forms/{id}/edit-fields', [AdminController::class, 'adminEditFields']);
    Route::post('/jnf/{id}/duplicate', [JnfController::class, 'duplicate']);
});
