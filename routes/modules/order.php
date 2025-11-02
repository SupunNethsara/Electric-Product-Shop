<?php


use Illuminate\Support\Facades\Route;


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/orders/getAllOrder' ,[App\Http\Controllers\OrderController\OderController::class, 'getAllOrder']);
    Route::post('/orders/direct', [App\Http\Controllers\OrderController\OderController::class, 'directOrder']);
    Route::put('/orders/update-status', [App\Http\Controllers\OrderController\OderController::class, 'updateStatus']);
    Route::post('/orders/checkout', [App\Http\Controllers\OrderController\OderController::class, 'cartCheckout']);
    Route::get('/orders/getUserOrder', [App\Http\Controllers\OrderController\OderController::class, 'getUserOrder']);
    Route::get('/orders/getUserOrders', [App\Http\Controllers\OrderController\OderController::class, 'getUserOrders']);
});
