<?php

use App\Http\Controllers\CategoryController\CategoryController;
use App\Http\Controllers\ProductController\ProductController;
use App\Http\Controllers\UserController\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

// 🔹 Category Routes
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::put('/categories/{id}/toggle', [CategoryController::class, 'toggleStatus']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

// 🔹 Product Routes
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products/validate', [ProductController::class, 'validateFiles']);
Route::post('/products/upload', [ProductController::class, 'uploadProducts']);
Route::post('/products/upload-images', [ProductController::class, 'uploadImages']);
