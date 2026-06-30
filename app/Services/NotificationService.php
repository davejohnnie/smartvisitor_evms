<?php

namespace App\Services;

use App\Models\Notification;

class NotificationService
{
    public static function send(int $userId, string $type, string $message): void
    {
        Notification::create([
            'u_id'    => $userId,
            'type'    => $type,
            'message' => $message,
            'is_read' => false,
        ]);
    }
}
