<?php

use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\ProductController;
use Illuminate\Support\Facades\Route;

// ---- Public (unauthenticated) endpoints ----
Route::prefix('staff')->group(function () {
    Route::post('login', [\App\Http\Controllers\Auth\StaffAuthController::class, 'login']);
    // (optional) staff register if you support it
});

Route::prefix('customer')->group(function () {
    Route::post('register', [\App\Http\Controllers\Auth\CustomerAuthController::class, 'register']);
    Route::post('login',    [\App\Http\Controllers\Auth\CustomerAuthController::class, 'login']);
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

// ---- Public READ for products & categories (both customers and staff can GET) ----
Route::apiResource('products', ProductController::class)->only(['index', 'show']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
