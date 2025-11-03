<?php
use Illuminate\Support\Facades\Route;

Route::get('/admin/all-users', [\App\Http\Controllers\UserController\UserController::class, 'getAllUsers']);
