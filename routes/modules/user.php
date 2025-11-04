<?php

use App\Http\Controllers\UserController\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/admin/all-users', [UserController::class, 'getAllUsers']);
Route::put('/admin/deactivate-user/{id}', [UserController::class, 'toggleUserStatus']);
