<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    // Fetch latest notifications for the logged-in user
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $notifications = Notification::where('u_id', $user->u_id)
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->get();

        $unreadCount = Notification::where('u_id', $user->u_id)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count'  => $unreadCount,
        ]);
    }

    // Mark a single notification as read
    public function markRead($id)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $notification = Notification::where('notification_id', $id)
            ->where('u_id', $user->u_id)
            ->firstOrFail();

        $notification->update(['is_read' => true]);

        return response()->json(['message' => 'Marked as read']);
    }

    // Mark all as read
    public function markAllRead()
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        Notification::where('u_id', $user->u_id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['message' => 'All marked as read']);
    }
}
