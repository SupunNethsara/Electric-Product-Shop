<?php


use Illuminate\Support\Facades\Route;


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/orders/getAllOrder' ,[App\Http\Controllers\OrderController\OderController::class, 'getAllOrder']);
    Route::get('/orders/getAllOrderNotification' ,[App\Http\Controllers\OrderController\OderController::class, 'getAllOrderNotification']);
    Route::post('/orders/direct', [App\Http\Controllers\OrderController\OderController::class, 'directOrder']);
    Route::put('/orders/update-status', [App\Http\Controllers\OrderController\OderController::class, 'updateStatus']);
    Route::post('/orders/checkout', [App\Http\Controllers\OrderController\OderController::class, 'cartCheckout']);
    Route::get('/orders/getUserOrder', [App\Http\Controllers\OrderController\OderController::class, 'getUserOrder']);
    Route::get('/orders/getUserOrders', [App\Http\Controllers\OrderController\OderController::class, 'getUserOrders']);
    Route::patch('/orders/{order}/mark-read', [App\Http\Controllers\OrderController\OderController::class, 'markAsRead']);
    Route::patch('/orders/mark-all-read', [App\Http\Controllers\OrderController\OderController::class, 'markAllAsRead']);
    Route::get('/orders/unread/count', [App\Http\Controllers\OrderController\OderController::class, 'getUnreadCount']);
    Route::get('/orders/unread/notifications', [App\Http\Controllers\OrderController\OderController::class, 'getUnreadNotifications']);
});
