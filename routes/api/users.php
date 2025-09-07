<?php
// Menu: allow any authenticated customer via Policy

use App\Http\Controllers\Api\V1\Admin\CategoryController;
use App\Http\Controllers\Api\V1\Admin\CustomerController;
use App\Http\Controllers\Api\V1\Admin\OrderController;
use App\Http\Controllers\Api\V1\Admin\ProductController;
use App\Http\Controllers\Api\V1\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::apiResource("users", UserController::class)->only(['index', 'show', 'store', 'update', 'destroy'])
    ->middleware('role:ADMIN,SUPER_ADMIN');
Route::apiResource("customers", CustomerController::class)->only(['index', 'show', 'store', 'update', 'destroy'])
    ->middleware('role:ADMIN,SUPER_ADMIN,STAFF');

Route::apiResource("orders", OrderController::class);
Route::apiResource('products', ProductController::class)->only(['index', 'show', 'store', 'update', 'destroy']);
Route::apiResource('categories', CategoryController::class)->only(['index', 'show', 'store', 'update', 'destroy']);
