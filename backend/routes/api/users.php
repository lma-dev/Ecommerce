<?php
// Menu: allow any authenticated customer via Policy

use App\Http\Controllers\Api\V1\Admin\CategoryController;
use App\Http\Controllers\Api\V1\Admin\CustomerController;
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Admin\OrderController;
use App\Http\Controllers\Api\V1\Admin\ProductController;
use App\Http\Controllers\Api\V1\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('role:ADMIN,SUPER_ADMIN')->group(function () {
    Route::apiResource('users', UserController::class);
});

Route::middleware('role:ADMIN,SUPER_ADMIN,STAFF')->group(function () {
    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('orders', OrderController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::get('/all-customers', [CustomerController::class, 'fetchAllCustomers']); //this route is for dropdown users
});

Route::get('dashboard', [DashboardController::class, 'index']);
