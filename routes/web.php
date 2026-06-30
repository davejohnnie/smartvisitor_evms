<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\GuardController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\VisitController;
use App\Http\Controllers\VisitorController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\NotificationController;
use Inertia\Inertia;

// Root redirect to login
Route::get('/', function () {
    return view('welcome');
});

// Auth routes (Breeze)
require __DIR__ . '/auth.php';

// ─── Tenant Routes ───────────────────────────────────────────
Route::middleware(['auth', 'tenant'])->prefix('tenant')->name('tenant.')->group(function () {
    Route::get('/dashboard',        [TenantController::class, 'dashboard'])->name('dashboard');
    Route::get('/invite',           [TenantController::class, 'inviteVisitor'])->name('invite');
    Route::get('/visitors',         [TenantController::class, 'visitorList'])->name('visitors');
    Route::get('/report-incident',  [TenantController::class, 'reportIncident'])->name('report-incident');
    Route::get('/profile',          [TenantController::class, 'profile'])->name('profile');

    // Visit actions
    Route::post('/visits',          [VisitController::class, 'store'])->name('visits.store');
    Route::delete('/visits/{id}',   [VisitController::class, 'destroy'])->name('visits.destroy');

    // Incident actions
    Route::post('/incidents',       [IncidentController::class, 'store'])->name('incidents.store');

    // Profile actions
    Route::patch('/profile',          [TenantController::class, 'updateProfile'])->name('profile.update');
    Route::patch('/password',         [TenantController::class, 'updatePassword'])->name('password.update');

    // Notifications
    Route::get('/notifications',              [NotificationController::class, 'index'])->name('notifications.index');
    Route::patch('/notifications/{id}/read',  [NotificationController::class, 'markRead'])->name('notifications.read');
    Route::patch('/notifications/mark-all',   [NotificationController::class, 'markAllRead'])->name('notifications.mark-all');
});

// ─── Guard Routes ─────────────────────────────────────────────
Route::middleware(['auth', 'guard'])->prefix('guard')->name('guard.')->group(function () {
    Route::get('/dashboard',        [GuardController::class, 'dashboard'])->name('dashboard');
    Route::get('/walk-in',          [GuardController::class, 'registerWalkIn'])->name('walk-in');
    Route::get('/scan',             [GuardController::class, 'scanQr'])->name('scan');
    Route::get('/visitors',         [GuardController::class, 'visitorList'])->name('visitors');

    // Visit actions
    Route::post('/visitors/walk-in',        [VisitorController::class, 'storeWalkIn'])->name('visitors.walk-in');
    Route::post('/visits/verify-qr',        [VisitController::class, 'verifyQr'])->name('visits.verify-qr');
    Route::patch('/visits/{id}/check-in',   [VisitController::class, 'checkIn'])->name('visits.check-in');
    Route::patch('/visits/{id}/check-out',  [VisitController::class, 'checkOut'])->name('visits.check-out');
});

// ─── Admin Routes ─────────────────────────────────────────────
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard',        [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/register-guard',   [AdminController::class, 'registerGuard'])->name('register-guard');
    Route::get('/reports',          [AdminController::class, 'visitorReport'])->name('reports');
    Route::get('/incidents',        [AdminController::class, 'incidents'])->name('incidents');
    Route::get('/guards', [AdminController::class, 'guardList'])->name('guards.index');
    Route::get('/tenants',                  [AdminController::class, 'tenantManagement'])->name('tenants');
    Route::patch('/tenants/{id}/approve',   [AdminController::class, 'approveTenant'])->name('tenants.approve');

    // Actions
    Route::post('/guards',                      [AdminController::class, 'storeGuard'])->name('guards.store');
    Route::patch('/incidents/{id}/resolve',     [IncidentController::class, 'resolve'])->name('incidents.resolve');
    Route::get('/reports/download',             [VisitController::class, 'downloadReport'])->name('reports.download');
});

Route::get('/pending-approval', function () {
    return Inertia::render('Auth/PendingApproval');
})->name('registration.pending');
