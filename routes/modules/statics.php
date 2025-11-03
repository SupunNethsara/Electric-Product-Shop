<?php

use Illuminate\Support\Facades\Route;

Route::get('/admin/statistics', [App\Http\Controllers\DashboardController\StaticsController::class, 'getStatistics']);
Route::get('/admin/chart', [App\Http\Controllers\DashboardController\StaticsController::class, 'getChartData']);
