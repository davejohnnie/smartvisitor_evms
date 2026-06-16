import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function VisitorReport({ visits, summary, selectedDate }) {
    const [date, setDate] = useState(selectedDate);

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setDate(newDate);
        router.get(route('admin.reports'), { date: newDate });
    };

    const handleDownload = () => {
        window.location.href = route('admin.reports.download') + `?date=${date}`;
    };

    const formatTime = (t) =>
        t ? new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';

    const statusBadge = (status) => {
        const map = {
            'pending':     'badge bg-warning text-dark',
            'checked-in':  'badge bg-success',
            'checked-out': 'badge bg-secondary',
        };
        return map[status] || 'badge bg-light';
    };

    const typeBadge = (type) => (
        <span className={`badge ${type === 'walkin' ? 'bg-info text-dark' : 'bg-primary'}`}>
            {type === 'walkin' ? 'Walk-in' : 'Invited'}
        </span>
    );

    return (
        <>
            <Head title="Visitor Reports" />

            <div className="page-card">
                <div className="page-title-row">
                    <h4 className="page-title">📄 Daily Visitor Report</h4>
                    <div className="d-flex gap-2 align-items-center">
                        <input
                            type="date"
                            className="form-control"
                            value={date}
                            onChange={handleDateChange}
                        />
                        <button className="btn btn-success" onClick={handleDownload}>
                            ⬇️ Download CSV
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="stats-grid mb-4">
                    <div className="stat-card stat-blue">
                        <span className="stat-number">{summary.total}</span>
                        <span className="stat-label">Total Visitors</span>
                    </div>
                    <div className="stat-card stat-yellow">
                        <span className="stat-number">{summary.pending}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                    <div className="stat-card stat-green">
                        <span className="stat-number">{summary.checked_in}</span>
                        <span className="stat-label">Checked In</span>
                    </div>
                    <div className="stat-card stat-gray">
                        <span className="stat-number">{summary.checked_out}</span>
                        <span className="stat-label">Checked Out</span>
                    </div>
                </div>

                {/* Visitor Table */}
                {visits.length === 0 ? (
                    <div className="empty-state">
                        <p>No visitor records found for {date}.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table sv-table">
                            <thead>
                                <tr>
                                    <th>Visitor</th>
                                    <th>Phone</th>
                                    <th>Unit</th>
                                    <th>Purpose</th>
                                    <th>Type</th>
                                    <th>Check In</th>
                                    <th>Check Out</th>
                                    <th>Status</th>
                                    <th>Guard</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visits.map((visit) => (
                                    <tr key={visit.visit_id}>
                                        <td>{visit.visitor?.full_name}</td>
                                        <td>{visit.visitor?.phone_number}</td>
                                        <td>
                                            {visit.tenant?.unit_number} — Block {visit.tenant?.block}
                                        </td>
                                        <td>{visit.purpose}</td>
                                        <td>{typeBadge(visit.visit_type)}</td>
                                        <td>{formatTime(visit.check_in)}</td>
                                        <td>{formatTime(visit.check_out)}</td>
                                        <td>
                                            <span className={statusBadge(visit.status)}>
                                                {visit.status}
                                            </span>
                                        </td>
                                        <td>{visit.security_guard?.user?.name ?? '—'}</td>
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

VisitorReport.layout = (page) => <AdminLayout>{page}</AdminLayout>;