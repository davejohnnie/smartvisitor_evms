<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Visit;
use Carbon\Carbon;

class GuardController extends Controller
{
    public function dashboard()
    {
        $today = Carbon::today()->toDateString();

        $stats = [
            'expected_today'  => Visit::where('visit_date', $today)
                ->where('visit_type', 'invited')
                ->count(),
            'checked_in'      => Visit::where('visit_date', $today)
                ->where('status', 'checked-in')
                ->count(),
            'checked_out'     => Visit::where('visit_date', $today)
                ->where('status', 'checked-out')
                ->count(),
            'walk_ins'        => Visit::where('visit_date', $today)
                ->where('visit_type', 'walkin')
                ->count(),
            'currently_in'    => Visit::where('visit_date', $today)
                ->where('status', 'checked-in')
                ->count(),
        ];

        // Recent activity — last 5 check-ins today
        $recentActivity = Visit::with(['visitor', 'tenant.user'])
            ->where('visit_date', $today)
            ->whereNotNull('check_in')
            ->orderBy('check_in', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Guard/Dashboard', [
            'stats'          => $stats,
            'recentActivity' => $recentActivity,
        ]);
    }

    public function registerWalkIn()
    {
        $tenants = \App\Models\Tenant::with('user')
            ->orderBy('block')
            ->orderBy('unit_number')
            ->get()
            ->map(function ($tenant) {
                return [
                    't_id'        => $tenant->t_id,
                    'unit_number' => $tenant->unit_number,
                    'block'       => $tenant->block,
                    'name'        => $tenant->user?->name,
                    'label'       => "Unit {$tenant->unit_number} — Block {$tenant->block} ({$tenant->user?->name})",
                ];
            });

        return Inertia::render('Guard/RegisterWalkIn', [
            'tenants' => $tenants,
        ]);
    }

    public function scanQr()
    {
        return Inertia::render('Guard/ScanQr');
    }

    public function visitorList()
    {
        $today = Carbon::today()->toDateString();

        $expected = Visit::with(['visitor', 'tenant.user'])
            ->where('visit_date', $today)
            ->where('visit_type', 'invited')
            ->where('status', 'pending')
            ->orderBy('expected_time_in', 'asc')
            ->get();

        $checkedIn = Visit::with(['visitor', 'tenant.user'])
            ->where('visit_date', $today)
            ->whereIn('status', ['checked-in', 'checked-out'])
            ->orderBy('check_in', 'desc')
            ->get();

        return Inertia::render('Guard/VisitorList', [
            'expected'  => $expected,
            'checkedIn' => $checkedIn,
        ]);
    }

    public function storeGuard(Request $request)
    {
        // logic coming in Section 7
    }
}
