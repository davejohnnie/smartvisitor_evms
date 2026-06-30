<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Visit;
use App\Models\Visitor;
use App\Services\SmsService;
use Carbon\Carbon;
use App\Services\NotificationService;

class VisitController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'full_name'          => 'required|string|max:100',
            'phone_number'       => 'required|string|max:20',
            'id_number'          => 'required|string|max:30',
            'purpose'            => 'required|string|max:100',
            'visit_date'         => 'required|date|after_or_equal:today',
            'expected_time_in'   => 'required',
            'expected_time_out'  => 'required|after:expected_time_in',
        ]);

        $tenant = auth()->user()->tenant;

        // Create or find visitor by id_number
        $visitor = Visitor::firstOrCreate(
            ['id_number' => $request->id_number],
            [
                'full_name'    => $request->full_name,
                'phone_number' => $request->phone_number,
            ]
        );

        // Generate unique QR token
        $qrToken = Str::random(32);

        $visit = Visit::create([
            'tenant_id'         => $tenant->t_id,
            'visitor_id'        => $visitor->v_id,
            'purpose'           => $request->purpose,
            'qr_token'          => $qrToken,
            'visit_type'        => 'invited',
            'status'            => 'pending',
            'visit_date'        => $request->visit_date,
            'expected_time_in'  => $request->expected_time_in,
            'expected_time_out' => $request->expected_time_out,
        ]);

        return redirect()->route('tenant.invite')
            ->with('success', 'Visitor invited successfully.')
            ->with('qr_token', $qrToken);
    }

    public function destroy($id)
    {
        $tenant = auth()->user()->tenant;

        $visit = Visit::where('visit_id', $id)
            ->where('tenant_id', $tenant->t_id)
            ->firstOrFail();

        $visit->delete();

        return redirect()->route('tenant.visitors')
            ->with('success', 'Visitor invitation deleted.');
    }

    public function verifyQr(Request $request)
    {
        $request->validate([
            'qr_token' => 'required|string',
        ]);

        $visit = Visit::with(['visitor', 'tenant.user'])
            ->where('qr_token', $request->qr_token)
            ->first();

        if (!$visit) {
            return response()->json([
                'valid'   => false,
                'message' => 'Invalid QR code. No matching visit found.',
            ], 404);
        }

        if ($visit->status === 'checked-in') {
            return response()->json([
                'valid'   => false,
                'message' => 'This visitor has already checked in.',
                'visit'   => $visit,
            ], 409);
        }

        if ($visit->status === 'checked-out') {
            return response()->json([
                'valid'   => false,
                'message' => 'This visitor has already checked out.',
                'visit'   => $visit,
            ], 409);
        }

        // Check if visit date matches today
        $today = \Carbon\Carbon::today()->toDateString();
        $visitDate = \Carbon\Carbon::parse($visit->visit_date)->toDateString();

        if ($visitDate !== $today) {
            return response()->json([
                'valid'   => false,
                'message' => "This invitation is for {$visitDate}, not today.",
                'visit'   => $visit,
            ], 409);
        }

        return response()->json([
            'valid'   => true,
            'message' => 'Valid QR code. Visitor verified.',
            'visit'   => $visit,
        ]);
    }

    public function checkIn(Request $request, $id)
    {
        /** @var \App\Models\User $user */
        $user  = auth()->user();
        $guard = $user->securityGuard;

        $visit = Visit::with(['visitor', 'tenant.user'])
            ->where('visit_id', $id)
            ->firstOrFail();

        if (!$visit->isPending()) {
            return response()->json([
                'message' => 'Visit is no longer pending.',
            ], 409);
        }

        $visit->update([
            'status'   => 'checked-in',
            'check_in' => now(),
            'guard_id' => $guard->guard_id,
        ]);

        // SMS notification to tenant
        $tenantPhone = $visit->tenant?->phone_number;
        $visitorName = $visit->visitor?->full_name;
        $timeIn      = Carbon::now()->format('h:i A');
        $unit        = $visit->tenant?->unit_number;

        if ($tenantPhone) {
            $sms     = new SmsService();
            $message = "SmartVisitor: {$visitorName} has arrived at the gate and checked in at {$timeIn}. Unit {$unit}.";
            $sms->send($tenantPhone, $message);
        }

        // Create notification for tenant
        // In-app notification
        if ($visit->tenant?->u_id) {
            NotificationService::send(
                $visit->tenant->u_id,
                'visitor_arrived',
                "{$visitorName} has arrived and checked in at {$timeIn}."
            );
        }

        return response()->json([
            'message' => 'Visitor checked in successfully.',
            'visit'   => $visit->fresh(['visitor', 'tenant.user']),
        ]);
    }

    public function checkOut(Request $request, $id)
    {
        $guard = auth()->user()->securityGuard;

        $visit = Visit::with(['visitor', 'tenant.user'])
            ->where('visit_id', $id)
            ->firstOrFail();

        if (!$visit->isCheckedIn()) {
            return response()->json([
                'message' => 'Visitor is not currently checked in.',
            ], 409);
        }

        $visit->update([
            'status'    => 'checked-out',
            'check_out' => now(),
            'guard_id'  => $guard->guard_id,
        ]);

        return response()->json([
            'message' => 'Visitor checked out successfully.',
            'visit'   => $visit->fresh(['visitor', 'tenant.user']),
        ]);
    }

    public function downloadReport(Request $request)
    {
        $date = $request->query('date', Carbon::today()->toDateString());

        $visits = Visit::with(['visitor', 'tenant.user', 'securityGuard.user'])
            ->where('visit_date', $date)
            ->orderBy('check_in', 'asc')
            ->get();

        $csv = "Visitor Name,Phone,ID Number,Tenant Unit,Block,Purpose,Visit Type,Status,Expected In,Expected Out,Check In,Check Out\n";

        foreach ($visits as $visit) {
            $csv .= implode(',', [
                '"' . $visit->visitor?->full_name . '"',
                $visit->visitor?->phone_number,
                $visit->visitor?->id_number,
                $visit->tenant?->unit_number,
                $visit->tenant?->block,
                '"' . $visit->purpose . '"',
                $visit->visit_type,
                $visit->status,
                $visit->expected_time_in,
                $visit->expected_time_out,
                $visit->check_in ? Carbon::parse($visit->check_in)->format('H:i:s') : '',
                $visit->check_out ? Carbon::parse($visit->check_out)->format('H:i:s') : '',
            ]) . "\n";
        }

        $filename = "visitor-report-{$date}.csv";

        return response($csv, 200, [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }
}
