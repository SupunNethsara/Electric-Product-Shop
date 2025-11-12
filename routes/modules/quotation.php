<?php

use App\Http\Controllers\QuotationController;
use Illuminate\Support\Facades\Route;

Route::prefix('quotations')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [QuotationController\QuotationController::class, 'index']);
    Route::post('/', [QuotationController\QuotationController::class, 'store']);
    Route::delete('/{id}', [QuotationController\QuotationController::class ,'destroy']);
    Route::delete('/clear', [QuotationController\QuotationController::class ,'clear']);
});
