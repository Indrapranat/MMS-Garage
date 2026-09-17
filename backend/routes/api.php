<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EoqRopController;
use App\Http\Controllers\SparepartController;
use App\Http\Controllers\StockInController;
use App\Http\Controllers\StockOutController;
use App\Http\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Workshop Inventory Management System
|--------------------------------------------------------------------------
*/

// Auth Routes
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});

// Helper function untuk mendaftarkan endpoint domain
$registerRoutes = function () {
    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);

    // Suppliers
    Route::get('/suppliers', [SupplierController::class, 'index']);
    Route::post('/suppliers', [SupplierController::class, 'store']);

    // Spareparts
    Route::get('/spareparts', [SparepartController::class, 'index']);
    Route::get('/spareparts/{id}', [SparepartController::class, 'show']);
    Route::post('/spareparts', [SparepartController::class, 'store']);

    // Stock Transactions
    Route::get('/stock-ins', [StockInController::class, 'index']);
    Route::post('/stock-ins', [StockInController::class, 'store']);

    Route::get('/stock-outs', [StockOutController::class, 'index']);
    Route::post('/stock-outs', [StockOutController::class, 'store']);

    // EOQ & ROP Analysis Methods
    Route::get('/eoq-rop', [EoqRopController::class, 'index']);
    Route::get('/eoq-rop/{id}', [EoqRopController::class, 'show']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
};

// Route standar /api/...
$registerRoutes();

// Route versi /api/v1/... (kompatibilitas frontend)
Route::prefix('v1')->group($registerRoutes);
