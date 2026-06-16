<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Visit;
use App\Models\Incident;

class TenantController extends Controller
{
    public function dashboard()
    {
        $tenant = auth()->user()->tenant;

        $stats = [
            'total_visitors'    => Visit::where('tenant_id', $tenant->t_id)->count(),
            'pending'           => Visit::where('tenant_id', $tenant->t_id)->where('status', 'pending')->count(),
            'checked_in'        => Visit::where('tenant_id', $tenant->t_id)->where('status', 'checked-in')->count(),
            'checked_out'       => Visit::where('tenant_id', $tenant->t_id)->where('status', 'checked-out')->count(),
            'open_incidents'    => Incident::where('tenant_id', $tenant->t_id)->where('status', 'pending')->count(),
        ];

        return Inertia::render('Tenant/Dashboard', [
            'tenant' => $tenant,
            'stats'  => $stats,
        ]);
    }

    public function inviteVisitor()
    {
        return Inertia::render('Tenant/InviteVisitor');
    }

    public function visitorList()
    {
        $tenant = auth()->user()->tenant;

        $visits = Visit::where('tenant_id', $tenant->t_id)
            ->with('visitor')
            ->orderBy('visit_date', 'desc')
            ->get();

        return Inertia::render('Tenant/VisitorList', [
            'visits' => $visits,
        ]);
    }

    public function reportIncident()
    {
        return Inertia::render('Tenant/ReportIncident');
    }

    public function profile()
    {
        $user   = auth()->user();
        $tenant = $user->tenant;

        return Inertia::render('Tenant/Profile', [
            'user'   => $user,
            'tenant' => $tenant,
        ]);
    }

    public function updateProfile(Request $request)
{
    $user   = auth()->user();
    $tenant = $user->tenant;

    $request->validate([
        'name'         => 'required|string|max:100',
        'phone_number' => 'required|string|max:20',
    ]);

    $user->update(['name' => $request->name]);
    $tenant->update(['phone_number' => $request->phone_number]);

    return redirect()->route('tenant.profile')
        ->with('success', 'Profile updated successfully.');
}

public function updatePassword(Request $request)
{
    $request->validate([
        'current_password' => 'required|current_password',
        'password'         => 'required|min:8|confirmed',
    ]);

    auth()->user()->update([
        'password' => \Illuminate\Support\Facades\Hash::make($request->password),
    ]);

    return redirect()->route('tenant.profile')
        ->with('success', 'Password changed successfully.');
}
}