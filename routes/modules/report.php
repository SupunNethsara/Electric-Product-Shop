<?php

use App\Http\Controllers\AdminsController\ReportController;
use Illuminate\Support\Facades\Route;

Route::get('/reports/orders', [ReportController::class, 'getOrders']);
Route::get('/reports/stats', [ReportController::class, 'getStats']);
Route::get('/reports/analytics', [ReportController::class, 'getOrderAnalytics']);
Route::get('/reports/export/orders', [ReportController::class, 'exportOrders']);
