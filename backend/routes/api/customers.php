<?php

// Customer-facing API routes
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Customer\CategoryController as CustomerCategoryController;
use App\Http\Controllers\Api\V1\Customer\ProductController as CustomerProductController;
use App\Http\Controllers\Api\V1\Customer\OrderController as CustomerOrderController;
use App\Http\Controllers\Api\V1\Customer\ProfileController;

// Categories
Route::get('categories', [CustomerCategoryController::class, 'index']);
Route::get('categories/{category}', [CustomerCategoryController::class, 'show']);

// Products
Route::get('products', [CustomerProductController::class, 'index']);
Route::get('products/{product}', [CustomerProductController::class, 'show']);

// Orders (own)
Route::get('orders', [CustomerOrderController::class, 'index']);
Route::get('orders/{order}', [CustomerOrderController::class, 'show']);
Route::post('orders', [CustomerOrderController::class, 'store']);

// Profile
Route::get('me', [ProfileController::class, 'show']);
Route::match(['put', 'patch'], 'me', [ProfileController::class, 'update']);
Route::delete('me', [ProfileController::class, 'destroy']);
