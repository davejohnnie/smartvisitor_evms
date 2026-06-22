import { Head, Link } from "@inertiajs/react";
import GuardLayout from "@/Layouts/GuardLayout";

export default function Dashboard({ stats, recentActivity }) {
    const formatTime = (timestamp) => {
        if (!timestamp) return "—";
        return new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const statusBadge = (status) => {
        const map = {
            pending: "badge bg-warning text-dark",
            "checked-in": "badge bg-success",
            "checked-out": "badge bg-secondary",
        };
        return map[status] || "badge bg-light";
    };

    return (
        <>
            <Head title="Guard Dashboard" />

            <div className="dashboard-header">
                <h2>Gate Dashboard 🛡️</h2>
                <p className="text-muted">
                    Today's visitor activity at a glance
                </p>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card stat-blue">
                    <span className="stat-number">{stats.expected_today}</span>
                    <span className="stat-label">Expected Today</span>
                </div>
                <div className="stat-card stat-green">
                    <span className="stat-number">{stats.currently_in}</span>
                    <span className="stat-label">Currently Inside</span>
                </div>
                <div className="stat-card stat-gray">
                    <span className="stat-number">{stats.checked_out}</span>
                    <span className="stat-label">Checked Out</span>
                </div>
                <div className="stat-card stat-yellow">
                    <span className="stat-number">{stats.walk_ins}</span>
                    <span className="stat-label">Walk-ins Today</span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions mb-4">
                <h5>Quick Actions</h5>
                <div className="action-buttons">
                    <Link
                        href={route("guard.scan")}
                        className="btn btn-success"
                    >
                        📷 Scan QR Code
                    </Link>
                    <Link
                        href={route("guard.walk-in")}
                        className="btn btn-primary"
                    >
                        ✍️ Register Walk-in
                    </Link>
                    <Link
                        href={route("guard.visitors")}
                        className="btn btn-outline-secondary"
                    >
                        👥 View Visitor List
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="page-card">
                <h5 className="page-title">Recent Check-ins Today</h5>

                {recentActivity.length === 0 ? (
                    <div className="empty-state">
                        <p>No check-ins recorded yet today.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table sv-table">
                            <thead>
                                <tr>
                                    <th>Visitor</th>
                                    <th>Tenant Unit</th>
                                    <th>Purpose</th>
                                    <th>Check In</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentActivity.map((visit) => (
                                    <tr key={visit.visit_id}>
                                        <td>{visit.visitor?.full_name}</td>
                                        <td>
                                            {visit.tenant?.unit_number} — Block{" "}
                                            {visit.tenant?.block}
                                        </td>
                                        <td>{visit.purpose}</td>
                                        <td>{formatTime(visit.check_in)}</td>
                                        <td>
                                            <span
                                                className={`badge ${visit.visit_type === "walkin" ? "bg-info text-dark" : "bg-primary"}`}
                                            >
                                                {visit.visit_type === "walkin"
                                                    ? "Walk-in"
                                                    : "Invited"}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={statusBadge(
                                                    visit.status,
                                                )}
                                            >
                                                {visit.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}

Dashboard.layout = (page) => <GuardLayout>{page}</GuardLayout>;
