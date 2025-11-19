<?php

use App\Http\Controllers\ProductController\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/active', [ProductController::class, 'getActiveProducts']);
Route::get('/products/home', [ProductController::class, 'homeProducts']);
Route::post('/products/validate', [ProductController::class, 'validateFiles']);
Route::post('/products/upload', [ProductController::class, 'uploadProducts']);
Route::post('/products/upload-images', [ProductController::class, 'uploadImages']);
Route::patch('/products/{id}/status', [ProductController::class, 'updateStatus']);

// Product view tracking routes
Route::post('/products/{id}/track-view', [ProductController::class, 'trackView']);
Route::get('/products/{id}/view-stats', [ProductController::class, 'getViewStats']);
Route::get('/products/most-viewed', [ProductController::class, 'getMostViewedProducts']);

//Excel Files
Route::get('/products/download/details-template', [ProductController::class, 'downloadProductDetailsTemplate']);
Route::get('/products/download/pricing-template', [ProductController::class, 'downloadProductPricingTemplate']);
Route::get('/products/download/all-templates', [ProductController::class, 'downloadAllTemplates']);

//Delete
Route::delete('/products/{id}', [ProductController::class, 'destroy']);
Route::post('/products/{id}/restore', [ProductController::class, 'restore']);
Route::delete('/products/{id}/force', [ProductController::class, 'forceDelete']);
Route::get('/products/trashed', [ProductController::class, 'trashed']);
