<?php

use App\Http\Controllers\Api\V1\AgentController;
use App\Http\Controllers\Api\V1\AppointmentController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ClientController;
use App\Http\Controllers\Api\V1\IncentiveController;
use App\Http\Controllers\Api\V1\SalesController;
use App\Http\Middleware\EnsureAgentOwnership;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // Public auth routes
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Protected routes — require Sanctum token
    Route::middleware(['auth:sanctum'])->group(function () {

        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Agent-only routes — validates agent profile exists
        Route::middleware([EnsureAgentOwnership::class])->group(function () {

            // Agent profile (UC-101, UC-102)
            Route::get('/agents/me', [AgentController::class, 'profile']);
            Route::put('/agents/me', [AgentController::class, 'updateProfile']);

            // Referral & appointment links (UC-103, UC-104)
            Route::get('/agents/me/referral-link', [AgentController::class, 'referralLink']);
            Route::get('/agents/me/appointment-link', [AgentController::class, 'appointmentLink']);

            // Dashboard stats (UC-105)
            Route::get('/agents/me/dashboard', [AgentController::class, 'dashboard']);

            // Clients (UC-201 to UC-206)
            Route::get('/clients', [ClientController::class, 'index']);
            Route::post('/clients', [ClientController::class, 'store']);
            Route::get('/clients/export', [ClientController::class, 'export']);
            Route::get('/clients/{id}', [ClientController::class, 'show']);
            Route::put('/clients/{id}', [ClientController::class, 'update']);

            // Sales (UC-301, UC-302)
            Route::get('/sales', [SalesController::class, 'index']);
            Route::get('/sales/{id}', [SalesController::class, 'show']);

            // Incentives (UC-401, UC-402)
            Route::get('/incentives', [IncentiveController::class, 'index']);
            Route::get('/incentives/{id}', [IncentiveController::class, 'show']);

            // Appointments (UC-501, UC-502, UC-503)
            Route::get('/appointments', [AppointmentController::class, 'index']);
            Route::post('/appointments', [AppointmentController::class, 'store']);
            Route::patch('/appointments/{id}/status', [AppointmentController::class, 'updateStatus']);
        });
    });
});
