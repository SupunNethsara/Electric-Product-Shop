<?php

use App\Http\Controllers\AdminsController\SuperAdminController;
use App\Http\Controllers\UserController\UserController;
use Illuminate\Support\Facades\Route;


    Route::get('/admin/all-users', [UserController::class, 'getAllUsers']);
    Route::put('/admin/deactivate-user/{id}', [UserController::class, 'toggleUserStatus']);


Route::middleware(['auth:sanctum', 'role:super_admin'])->group(function () {
    Route::get('/superadmin/admins', [SuperAdminController::class, 'index']);
    Route::post('/superadmin/add-admin', [SuperAdminController::class, 'addAdmins']);
    Route::put('/superadmin/admins/{id}', [SuperAdminController::class, 'updateAdmin']);
    Route::delete('/superadmin/admins/{id}', [SuperAdminController::class, 'deleteAdmin']);
    Route::get('/superadmin/all-users', [UserController::class, 'getAllUsersToSuperAdmin']);
});
