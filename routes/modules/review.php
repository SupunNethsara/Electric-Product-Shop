<?php


use App\Http\Controllers\ReviewController\ReviewController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/products/{product}/reviews', [ReviewController::class, 'store']);
    Route::put('/products/{product}/reviews/{review}', [ReviewController::class, 'update']);
    Route::delete('/products/{product}/reviews/{review}', [ReviewController::class, 'destroy']);
});

Route::get('/products/{product}/reviews', [ReviewController::class, 'index']);
Route::get('/products/{product}/rating-summary', [ReviewController::class, 'getProductRatingSummary']);
