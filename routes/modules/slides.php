<?php

use App\Http\Controllers\AdminsController\BrandingController\BrandingController;
use Illuminate\Support\Facades\Route;

Route::apiResource('slides', BrandingController::class);
Route::put('slides/order/update', [BrandingController::class, 'updateOrder']);
Route::put('slides/{slide}/toggle-status', [BrandingController::class, 'toggleStatus']);
