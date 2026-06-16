import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function Incidents({ incidents, summary }) {
    const { flash } = usePage().props;
    const [filter, setFilter] = useState('all');

    const handleResolve = (id, title) => {
        if (confirm(`Mark "${title}" as resolved?`)) {
            router.patch(route('admin.incidents.resolve', id));
        }
    };

    const severityBadge = (severity) => {
        const map = {
            'low':    'badge bg-success',
            'medium': 'badge bg-warning text-dark',
            'high':   'badge bg-danger',
        };
        return map[severity] || 'badge bg-light';
    };

    const statusBadge = (status) => {
        return status === 'pending'
            ? 'badge bg-warning text-dark'
            : 'badge bg-secondary';
    };

    const filteredIncidents = incidents.filter((i) => {
        if (filter === 'all') return true;
        return i.status === filter;
    });

    const formatDate = (d) =>
        d ? new Date(d).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '—';

    return (
        <>
            <Head title="Incidents" />

            <div className="page-card">
                <h4 className="page-title">⚠️ Incident Management</h4>

                {flash?.success && (
                    <div className="alert alert-success mb-4">{flash.success}</div>
                )}
                {flash?.error && (
                    <div className="alert alert-danger mb-4">{flash.error}</div>
                )}

                {/* Summary Cards */}
                <div className="stats-grid mb-4">
                    <div className="stat-card stat-blue">
                        <span className="stat-number">{summary.total}</span>
                        <span className="stat-label">Total Incidents</span>
                    </div>
                    <div className="stat-card stat-yellow">
                        <span className="stat-number">{summary.pending}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                    <div className="stat-card stat-green">
                        <span className="stat-number">{summary.resolved}</span>
                        <span className="stat-label">Resolved</span>
                    </div>
                    <div className="stat-card stat-red">
                        <span className="stat-number">{summary.high}</span>
                        <span className="stat-label">High Priority (Open)</span>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="profile-tabs mb-4">
                    <button
                        className={`profile-tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`profile-tab ${filter === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={`profile-tab ${filter === 'resolved' ? 'active' : ''}`}
                        onClick={() => setFilter('resolved')}
                    >
                        Resolved
                    </button>
                </div>

                {/* Incidents List */}
                {filteredIncidents.length === 0 ? (
                    <div className="empty-state">
                        <p>No incidents found.</p>
                    </div>
                ) : (
                    <div className="incidents-list">
                        {filteredIncidents.map((incident) => (
                            <div key={incident.i_id} className="incident-card">
                                <div className="incident-card-header">
                                    <div>
                                        <h6 className="incident-title">{incident.title}</h6>
                                        <span className="incident-meta">
                                            Reported by {incident.tenant?.user?.name} —{' '}
                                            {formatDate(incident.created_at)}
                                        </span>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <span className={severityBadge(incident.severity)}>
                                            {incident.severity}
                                        </span>
                                        <span className={statusBadge(incident.status)}>
                                            {incident.status}
                                        </span>
                                    </div>
                                </div>

                                <p className="incident-details">{incident.details}</p>

                                <div className="incident-footer">
                                    <span className="incident-type">📁 {incident.type}</span>

                                    {incident.status === 'pending' ? (
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => handleResolve(incident.i_id, incident.title)}
                                        >
                                            ✅ Mark Resolved
                                        </button>
                                    ) : (
                                        <span className="resolved-meta">
                                            Resolved by {incident.resolved_by?.name} on {formatDate(incident.resolved_at)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

Incidents.layout = (page) => <AdminLayout>{page}</AdminLayout>;