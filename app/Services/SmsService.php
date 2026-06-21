<?php

namespace App\Services;

use AfricasTalking\SDK\AfricasTalking;
use Illuminate\Support\Facades\Log;

class SmsService
{
    protected $sms;

    public function __construct()
    {
        $AT  = new AfricasTalking(
            config('services.africastalking.username'),
            config('services.africastalking.api_key')
        );
        $this->sms = $AT->sms();
    }

    public function send(string $to, string $message): bool
    {
        try {
            // Ensure number is in international format
            $to = $this->formatNumber($to);

            $result = $this->sms->send([
                'to'      => $to,
                'message' => $message,
                'from'    => config('services.africastalking.sender_id') ?: null,
            ]);

            Log::info('SMS sent', ['to' => $to, 'result' => $result]);
            return true;
        } catch (\Exception $e) {
            Log::error('SMS failed', ['to' => $to, 'error' => $e->getMessage()]);
            return false;
        }
    }

    private function formatNumber(string $number): string
    {
        // Strip spaces and dashes
        $number = preg_replace('/[\s\-]/', '', $number);

        // Convert 07XXXXXXXX → +2547XXXXXXXX
        if (str_starts_with($number, '0')) {
            $number = '+254' . substr($number, 1);
        }

        // If already has country code without +
        if (str_starts_with($number, '254')) {
            $number = '+' . $number;
        }

        return $number;
    }
}
