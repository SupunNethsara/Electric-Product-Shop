<?php

use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/orders/direct', [OrderController::class, 'directOrder']);
    Route::post('/orders/checkout', [OrderController::class, 'cartCheckout']);
});
