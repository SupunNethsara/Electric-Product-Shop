<?php

use App\Http\Controllers\CategoryController\CategoryController;
use Illuminate\Support\Facades\Route;

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/active', [CategoryController::class, 'getActiveCategories']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::put('/categories/{id}/toggle', [CategoryController::class, 'toggleStatus']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
