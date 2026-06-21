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

        $stats = [
            'total_visitors_today' => Visit::where('visit_date', $today)->count(),
            'checked_in'           => Visit::where('visit_date', $today)->where('status', 'checked-in')->count(),
            'checked_out'          => Visit::where('visit_date', $today)->where('status', 'checked-out')->count(),
            'pending_incidents'    => Incident::where('status', 'pending')->count(),
            'total_guards'         => Guard::count(),
        ];

        // Visitors per hour today — for the chart (check-in times)
        $visitsToday = Visit::where('visit_date', $today)
            ->whereNotNull('check_in')
            ->get();

        $hourlyData = array_fill(0, 24, 0);
        foreach ($visitsToday as $visit) {
            $hour = Carbon::parse($visit->check_in)->hour;
            $hourlyData[$hour]++;
        }

        // Peak hour
        $peakHour = array_keys($hourlyData, max($hourlyData))[0] ?? 0;

        // Last 7 days visitor count — for trend
        $weeklyTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $weeklyTrend[] = [
                'date'  => $date->format('D, M j'),
                'count' => Visit::where('visit_date', $date->toDateString())->count(),
            ];
        }

        // Visit type breakdown — today
        $visitTypeBreakdown = [
            'invited' => Visit::where('visit_date', $today)->where('visit_type', 'invited')->count(),
            'walkin'  => Visit::where('visit_date', $today)->where('visit_type', 'walkin')->count(),
        ];

        // Incident severity breakdown — all time
        $incidentSeverity = [
            'low'    => Incident::where('severity', 'low')->count(),
            'medium' => Incident::where('severity', 'medium')->count(),
            'high'   => Incident::where('severity', 'high')->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats'       => $stats,
            'hourlyData'  => $hourlyData,
            'peakHour'    => $peakHour,
            'weeklyTrend' => $weeklyTrend,
            'visitTypeBreakdown' => $visitTypeBreakdown,
            'incidentSeverity' => $incidentSeverity,
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
