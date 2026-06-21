import { Head, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Guards({ guards, summary }) {
    const { flash } = usePage().props;

    const shiftBadge = (shift) => {
        if (shift.toLowerCase().includes("morning"))
            return "badge bg-warning text-dark";
        if (shift.toLowerCase().includes("afternoon"))
            return "badge bg-primary";
        if (shift.toLowerCase().includes("night")) return "badge bg-dark";
        return "badge bg-secondary";
    };

    const statusBadge = (status) => {
        return status === "on-duty" ? "badge bg-success" : "badge bg-secondary";
    };

    return (
        <>
            <Head title="Guard Management" />

            <div className="page-card">
                <div className="page-title-row">
                    <h4 className="page-title">🛡️ Guard Management</h4>
                </div>

                {flash?.success && (
                    <div className="alert alert-success mb-4">
                        {flash.success}
                    </div>
                )}

                {/* Summary Cards */}
                <div className="stats-grid mb-4">
                    <div className="stat-card stat-blue">
                        <span className="stat-number">{summary.total}</span>
                        <span className="stat-label">Total Guards</span>
                    </div>
                    <div className="stat-card stat-green">
                        <span className="stat-number">{summary.on_duty}</span>
                        <span className="stat-label">On Duty</span>
                    </div>
                    <div className="stat-card stat-gray">
                        <span className="stat-number">{summary.off_duty}</span>
                        <span className="stat-label">Off Duty</span>
                    </div>
                </div>

                {/* Guards Table */}
                {guards.length === 0 ? (
                    <div className="empty-state">
                        <p>No guards registered yet.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table sv-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Badge</th>
                                    <th>Shift</th>
                                    <th>Status</th>
                                    <th>Registered</th>
                                </tr>
                            </thead>
                            <tbody>
                                {guards.map((guard) => (
                                    <tr key={guard.guard_id}>
                                        <td>{guard.user?.name}</td>
                                        <td>{guard.user?.email}</td>
                                        <td>{guard.phone_number}</td>
                                        <td>
                                            <span className="badge bg-light text-dark border">
                                                {guard.badge_number}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={shiftBadge(
                                                    guard.shift,
                                                )}
                                            >
                                                {guard.shift}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={statusBadge(
                                                    guard.status,
                                                )}
                                            >
                                                {guard.status}
                                            </span>
                                        </td>
                                        <td>
                                            {new Date(
                                                guard.created_at,
                                            ).toLocaleDateString("en-KE", {
                                                dateStyle: "medium",
                                            })}
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

Guards.layout = (page) => <AdminLayout>{page}</AdminLayout>;
