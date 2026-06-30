<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Visit;
use App\Services\SmsService;
use Carbon\Carbon;
use App\Services\NotificationService;

class CheckOverstayedVisitors extends Command
{
    protected $signature   = 'visitors:check-overstay';
    protected $description = 'Notify tenants when their visitor has overstayed';

    public function handle(): void
    {
        $now   = Carbon::now();
        $today = $now->toDateString();

        // Get all checked-in visits for today that haven't been notified yet
        $visits = Visit::with(['visitor', 'tenant'])
            ->where('status', 'checked-in')
            ->where('visit_date', $today)
            ->where('overstay_notified', false)
            ->get();

        $sms   = new SmsService();
        $count = 0;

        foreach ($visits as $visit) {
            // Combine visit date + expected_time_out into a full datetime
            $expectedOut = Carbon::parse(
                $visit->visit_date . ' ' . $visit->expected_time_out
            );

            // Only notify if expected checkout time has passed
            if ($now->greaterThan($expectedOut)) {
                $tenantPhone = $visit->tenant?->phone_number;
                $visitorName = $visit->visitor?->full_name;
                $timeOut     = $expectedOut->format('h:i A');
                $unit        = $visit->tenant?->unit_number;

                if ($tenantPhone) {
                    $message = "SmartVisitor Alert: Your visitor {$visitorName} was expected to leave by {$timeOut} but has not checked out yet. Unit {$unit}.";
                    $sms->send($tenantPhone, $message);
                }

                // In-app notification
                if ($visit->tenant?->u_id) {
                    NotificationService::send(
                        $visit->tenant->u_id,
                        'overstay',
                        "{$visitorName} was expected to leave by {$timeOut} but has not checked out yet."
                    );
                }

                // Mark as notified so we don't spam
                $visit->update(['overstay_notified' => true]);
                $count++;
            }
        }

        $this->info("Checked overstay — {$count} notification(s) sent.");
    }
}
