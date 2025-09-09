<?php

use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\ProductController;
use Illuminate\Support\Facades\Route;

// ---- Public (unauthenticated) endpoints ----
Route::prefix('staff')->group(function () {
    Route::post('login', [\App\Http\Controllers\Auth\StaffAuthController::class, 'login']);
    // Password reset (staff)
    Route::post('forgot-password', [\App\Http\Controllers\Auth\PasswordResetLinkController::class, 'store']);
    Route::post('reset-password', [\App\Http\Controllers\Auth\NewPasswordController::class, 'store']);
    // (optional) staff register if you support it
});

Route::prefix('customer')->group(function () {
    Route::post('register', [\App\Http\Controllers\Auth\CustomerAuthController::class, 'register']);
    Route::post('login',    [\App\Http\Controllers\Auth\CustomerAuthController::class, 'login']);
    Route::post('logout',   [\App\Http\Controllers\Auth\CustomerAuthController::class, 'logout'])
        ->middleware(['auth:sanctum', 'tokenable:customer']);
    // Password reset (customer)
    Route::post('forgot-password', [\App\Http\Controllers\Auth\CustomerPasswordResetLinkController::class, 'store']);
    Route::post('reset-password', [\App\Http\Controllers\Auth\CustomerNewPasswordController::class, 'store']);
});

// ---- Protected groups mount their own sub-files ----
// Staff/Admin/Superadmin
Route::prefix('staff')
    ->middleware(['auth:sanctum', 'tokenable:user'])
    ->group(function () {
        require __DIR__ . '/api/users.php';
    });

// Customers
Route::prefix('customer')
    ->middleware(['auth:sanctum', 'tokenable:customer'])
    ->group(function () {
        require __DIR__ . '/api/customers.php';
    });
