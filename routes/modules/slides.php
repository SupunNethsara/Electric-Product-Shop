<?php

use App\Http\Controllers\AdminsController\BrandingController\BrandingController;
use Illuminate\Support\Facades\Route;

Route::middleware(['api'])->group(function () {
    Route::prefix('slides')->group(function () {
        Route::get('/', [BrandingController::class, 'index']);
        Route::post('/', [BrandingController::class, 'store']);
        Route::get('/{slide}', [BrandingController::class, 'show']);
        Route::put('/{slide}', [BrandingController::class, 'update']);
        Route::delete('/{slide}', [BrandingController::class, 'destroy']);
        Route::put('/order/update', [BrandingController::class, 'updateOrder']);
        Route::put('/{slide}/toggle-status', [BrandingController::class, 'toggleStatus']);
    });
});
