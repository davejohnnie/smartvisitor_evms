<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Visit;
use App\Models\Incident;
use App\Models\Guard;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function dashboard()
    {
        $today = Carbon::today()->toDateString();

        // Single query for today's visits, then derive all stats from the collection in memory
        $visitsToday = Visit::where('visit_date', $today)->get();

        $stats = [
            'total_visitors_today' => $visitsToday->count(),
            'checked_in'           => $visitsToday->where('status', 'checked-in')->count(),
            'checked_out'          => $visitsToday->where('status', 'checked-out')->count(),
            'pending_incidents'    => Incident::where('status', 'pending')->count(),
            'total_guards'         => Guard::count(),
        ];

        // Visit type breakdown — derived from the same collection, no extra query
        $visitTypeBreakdown = [
            'invited' => $visitsToday->where('visit_type', 'invited')->count(),
            'walkin'  => $visitsToday->where('visit_type', 'walkin')->count(),
        ];

        // Hourly breakdown — derived from the same collection
        $hourlyData = array_fill(0, 24, 0);
        foreach ($visitsToday->whereNotNull('check_in') as $visit) {
            $hour = Carbon::parse($visit->check_in)->hour;
            $hourlyData[$hour]++;
        }
        $peakHour = array_keys($hourlyData, max($hourlyData))[0] ?? 0;

        // Incident severity — single grouped query instead of 3 separate counts
        $incidentCounts = Incident::selectRaw('severity, count(*) as count')
            ->groupBy('severity')
            ->pluck('count', 'severity');

        $incidentSeverity = [
            'low'    => $incidentCounts['low'] ?? 0,
            'medium' => $incidentCounts['medium'] ?? 0,
            'high'   => $incidentCounts['high'] ?? 0,
        ];

        // Weekly trend — single grouped query instead of 7 separate counts
        $startDate = Carbon::today()->subDays(6)->toDateString();
        $weeklyCounts = Visit::selectRaw('visit_date, count(*) as count')
            ->where('visit_date', '>=', $startDate)
            ->groupBy('visit_date')
            ->pluck('count', 'visit_date');

        $weeklyTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $weeklyTrend[] = [
                'date'  => $date->format('D, M j'),
                'count' => $weeklyCounts[$date->toDateString()] ?? 0,
            ];
        }

        return Inertia::render('Admin/Dashboard', [
            'stats'               => $stats,
            'hourlyData'          => $hourlyData,
            'peakHour'            => $peakHour,
            'weeklyTrend'         => $weeklyTrend,
            'visitTypeBreakdown'  => $visitTypeBreakdown,
            'incidentSeverity'    => $incidentSeverity,
        ]);
    }

    public function registerGuard()
    {
        return Inertia::render('Admin/RegisterGuard');
    }

    public function visitorReport(Request $request)
    {
        $date = $request->query('date', Carbon::today()->toDateString());

        $visits = Visit::with(['visitor', 'tenant.user', 'securityGuard.user'])
            ->where('visit_date', $date)
            ->orderBy('check_in', 'asc')
            ->get();

        $summary = [
            'total'      => $visits->count(),
            'invited'    => $visits->where('visit_type', 'invited')->count(),
            'walkin'     => $visits->where('visit_type', 'walkin')->count(),
            'checked_in' => $visits->where('status', 'checked-in')->count(),
            'checked_out' => $visits->where('status', 'checked-out')->count(),
            'pending'    => $visits->where('status', 'pending')->count(),
        ];

        return Inertia::render('Admin/VisitorReport', [
            'visits'        => $visits,
            'summary'       => $summary,
            'selectedDate'  => $date,
        ]);
    }

    public function incidents()
    {
        $incidents = Incident::with(['tenant.user', 'resolvedBy'])
            ->orderBy('created_at', 'desc')
            ->get();

        $summary = [
            'total'    => $incidents->count(),
            'pending'  => $incidents->where('status', 'pending')->count(),
            'resolved' => $incidents->where('status', 'resolved')->count(),
            'high'     => $incidents->where('severity', 'high')->where('status', 'pending')->count(),
        ];

        return Inertia::render('Admin/Incidents', [
            'incidents' => $incidents,
            'summary'   => $summary,
        ]);
    }

    public function storeGuard(Request $request)
    {
        $request->validate([
            'name'          => 'required|string|max:100',
            'email'         => 'required|string|email|max:100|unique:users,email',
            'password'      => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()],
            'phone_number'  => 'required|string|max:20',
            'badge_number'  => 'required|string|max:20|unique:guards,badge_number',
            'shift'         => 'required|string|max:40',
        ]);

        $user = \App\Models\User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'role'     => 'guard',
        ]);

        Guard::create([
            'u_id'         => $user->u_id,
            'phone_number' => $request->phone_number,
            'badge_number' => $request->badge_number,
            'shift'        => $request->shift,
            'status'       => 'on-duty',
        ]);

        return redirect()->route('admin.register-guard')
            ->with('success', "Guard {$request->name} has been registered successfully.");
    }

    public function guardList()
    {
        $guards = Guard::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        $summary = [
            'total'    => $guards->count(),
            'on_duty'  => $guards->where('status', 'on-duty')->count(),
            'off_duty' => $guards->where('status', 'off-duty')->count(),
        ];

        return Inertia::render('Admin/Guards', [
            'guards'  => $guards,
            'summary' => $summary,
        ]);
    }
}
