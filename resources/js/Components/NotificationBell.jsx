import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const getXsrfToken = () => {
        return decodeURIComponent(
            document.cookie
                .split("; ")
                .find((r) => r.startsWith("XSRF-TOKEN="))
                ?.split("=")[1] || "",
        );
    };

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(route("tenant.notifications.index"));
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unread_count);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds for new notifications
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkRead = async (id) => {
        try {
            await axios.patch(
                route("tenant.notifications.read", id),
                {},
                { headers: { "X-XSRF-TOKEN": getXsrfToken() } },
            );
            setNotifications((prev) =>
                prev.map((n) =>
                    n.notification_id === id ? { ...n, is_read: true } : n,
                ),
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await axios.patch(
                route("tenant.notifications.mark-all"),
                {},
                { headers: { "X-XSRF-TOKEN": getXsrfToken() } },
            );
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, is_read: true })),
            );
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    const typeIcon = (type) => {
        const map = {
            visitor_arrived: "🚪",
            overstay: "⏰",
            incident_resolved: "✅",
        };
        return map[type] || "🔔";
    };

    const formatTime = (t) => {
        const date = new Date(t);
        const now = new Date();
        const diffMins = Math.floor((now - date) / 60000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
        return date.toLocaleDateString("en-KE", { dateStyle: "medium" });
    };

    return (
        <div className="notification-bell-wrapper" ref={dropdownRef}>
            <button
                className="notification-bell-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                🔔
                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-dropdown-header">
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                            <button
                                className="mark-all-read-btn"
                                onClick={handleMarkAllRead}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="notification-dropdown-body">
                        {notifications.length === 0 ? (
                            <div className="notification-empty">
                                <span>🔕</span>
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.notification_id}
                                    className={`notification-item ${!n.is_read ? "unread" : ""}`}
                                    onClick={() =>
                                        !n.is_read &&
                                        handleMarkRead(n.notification_id)
                                    }
                                >
                                    <span className="notification-icon">
                                        {typeIcon(n.type)}
                                    </span>
                                    <div className="notification-content">
                                        <p>{n.message}</p>
                                        <span className="notification-time">
                                            {formatTime(n.created_at)}
                                        </span>
                                    </div>
                                    {!n.is_read && (
                                        <span className="unread-dot"></span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
