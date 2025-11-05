<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminsController\SystemSettingController\SystemSettingController;

Route::get('/system-settings', [SystemSettingController::class, 'index']);
Route::put('/system-settings', [SystemSettingController::class, 'update']);
