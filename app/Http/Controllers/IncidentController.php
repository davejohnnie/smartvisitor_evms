<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Incident;

class IncidentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'title'    => 'required|string|max:150',
            'type'     => 'required|string|max:50',
            'severity' => 'required|in:low,medium,high',
            'details'  => 'required|string',
        ]);

        $tenant = auth()->user()->tenant;

        Incident::create([
            'tenant_id' => $tenant->t_id,
            'title'     => $request->title,
            'type'      => $request->type,
            'severity'  => $request->severity,
            'details'   => $request->details,
            'status'    => 'pending',
        ]);

        return redirect()->route('tenant.dashboard')
            ->with('success', 'Incident reported successfully.');
    }

    public function resolve(Request $request, $id)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $incident = Incident::findOrFail($id);

        if ($incident->isResolved()) {
            return back()->with('error', 'This incident is already resolved.');
        }

        $incident->update([
            'status'      => 'resolved',
            'resolved_by' => $user->u_id,
            'resolved_at' => now(),
        ]);

        return redirect()->route('admin.incidents')
            ->with('success', 'Incident marked as resolved.');
    }
}
