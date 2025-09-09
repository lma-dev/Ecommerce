<?php
// Menu: allow any authenticated customer via Policy

use App\Http\Controllers\Api\V1\Admin\CategoryController;
use App\Http\Controllers\Api\V1\Admin\CustomerController;
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Admin\OrderController;
use App\Http\Controllers\Api\V1\Admin\ProductController;
use App\Http\Controllers\Api\V1\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::apiResource("users", UserController::class)
    ->middleware('role:ADMIN,SUPER_ADMIN');
Route::apiResource("customers", CustomerController::class)
    ->middleware('role:ADMIN,SUPER_ADMIN,STAFF');

Route::apiResource("orders", OrderController::class);
Route::apiResource('products', ProductController::class);
Route::apiResource('categories', CategoryController::class);

// Dashboard summary counts
Route::get('dashboard', [DashboardController::class, 'index']);
