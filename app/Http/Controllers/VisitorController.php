<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Visit;
use App\Models\Visitor;
use App\Models\Tenant;
use App\Services\SmsService;
use Carbon\Carbon;
use App\Services\NotificationService;

class VisitorController extends Controller
{
    public function storeWalkIn(Request $request)
    {
        $request->validate([
            'full_name'          => 'required|string|max:100',
            'phone_number'       => 'required|string|max:20',
            'id_number'          => 'required|string|max:30',
            'purpose'            => 'required|string|max:100',
            'tenant_id'          => 'required|exists:tenants,t_id',
            'expected_time_out'  => 'required',
        ]);

        $now = Carbon::now();

        // Validate that expected_time_out is after the current time
        $expectedOut = Carbon::parse($now->toDateString() . ' ' . $request->expected_time_out);

        if ($expectedOut->lessThanOrEqualTo($now)) {
            return back()
                ->withErrors(['expected_time_out' => 'Please select a check-out time later than the current time.'])
                ->withInput();
        }

        /** @var \App\Models\User $user */
        $user  = auth()->user();
        $guard = $user->securityGuard;

        // Create or find visitor by id_number
        $visitor = Visitor::firstOrCreate(
            ['id_number' => $request->id_number],
            [
                'full_name'    => $request->full_name,
                'phone_number' => $request->phone_number,
            ]
        );

        // Create visit and immediately check in
        $visit = Visit::create([
            'tenant_id'         => $request->tenant_id,
            'visitor_id'        => $visitor->v_id,
            'guard_id'          => $guard->guard_id,
            'purpose'           => $request->purpose,
            'qr_token'          => Str::random(32),
            'visit_type'        => 'walkin',
            'status'            => 'checked-in',
            'visit_date'        => $now->toDateString(),
            'expected_time_in'  => $now->format('H:i'),
            'expected_time_out' => $request->expected_time_out,
            'check_in'          => $now,
        ]);


        // SMS notification to tenant
        $tenantPhone = $visit->tenant?->phone_number;
        $visitorName = $visitor->full_name;
        $timeIn      = Carbon::now()->format('h:i A');
        $unit        = $visit->tenant?->unit_number;

        if ($tenantPhone) {
            $sms     = new SmsService();
            $message = "SmartVisitor: {$visitorName} has walked in and checked in at {$timeIn}. Unit {$unit}.";
            $sms->send($tenantPhone, $message);
        }
        // In-app notification
        if ($visit->tenant?->u_id) {
            NotificationService::send(
                $visit->tenant->u_id,
                'visitor_arrived',
                "{$visitor->full_name} (walk-in) has checked in at {$timeIn}."
            );
        }

        return redirect()->route('guard.visitors')
            ->with('success', "Walk-in visitor {$visitor->full_name} has been checked in.");
    }
}
