import { Head, usePage } from '@inertiajs/react';
import GuardLayout from '@/Layouts/GuardLayout';
import { useState } from 'react';
import axios from 'axios';

export default function VisitorList({ expected, checkedIn }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab]           = useState('inside');
    const [actionLoading, setActionLoading]   = useState(null);
    const [actionMsg, setActionMsg]           = useState(null);
    const [localCheckedIn, setLocalCheckedIn] = useState(checkedIn);
    const [localExpected, setLocalExpected]   = useState(expected);

    const getXsrfToken = () => {
        return decodeURIComponent(
            document.cookie
                .split('; ')
                .find((r) => r.startsWith('XSRF-TOKEN='))
                ?.split('=')[1] || ''
        );
    };

    const handleCheckOut = async (visit) => {
        setActionLoading(visit.visit_id);
        try {
            await axios.patch(
                route('guard.visits.check-out', visit.visit_id),
                {},
                { headers: { 'X-XSRF-TOKEN': getXsrfToken() } }
            );

            // Update status locally
            setLocalCheckedIn((prev) =>
                prev.map((v) =>
                    v.visit_id === visit.visit_id
                        ? { ...v, status: 'checked-out', check_out: new Date().toISOString() }
                        : v
                )
            );
            setActionMsg({
                type: 'success',
                text: `${visit.visitor?.full_name} has been checked out.`,
            });
        } catch (err) {
            setActionMsg({
                type: 'error',
                text: err.response?.data?.message || 'Check-out failed.',
            });
        } finally {
            setActionLoading(null);
        }
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

    const currentlyInside  = localCheckedIn.filter(v => v.status === 'checked-in');
    const alreadyOut       = localCheckedIn.filter(v => v.status === 'checked-out');

    return (
        <>
            <Head title="Visitor List" />

            <div className="page-card">
                <h4 className="page-title">👥 Today's Visitors</h4>

                {flash?.success && (
                    <div className="alert alert-success mb-4">{flash.success}</div>
                )}

                {actionMsg && (
                    <div className={`alert ${actionMsg.type === 'success' ? 'alert-success' : 'alert-danger'} mb-4`}>
                        {actionMsg.type === 'success' ? '✅' : '❌'} {actionMsg.text}
                        <button
                            className="btn-close float-end"
                            onClick={() => setActionMsg(null)}
                        />
                    </div>
                )}

                {/* Tabs */}
                <div className="profile-tabs mb-4">
                    <button
                        className={`profile-tab ${activeTab === 'inside' ? 'active' : ''}`}
                        onClick={() => setActiveTab('inside')}
                    >
                        🏠 Inside Estate
                        <span className="tab-count">{currentlyInside.length}</span>
                    </button>
                    <button
                        className={`profile-tab ${activeTab === 'expected' ? 'active' : ''}`}
                        onClick={() => setActiveTab('expected')}
                    >
                        🕐 Expected
                        <span className="tab-count">{localExpected.length}</span>
                    </button>
                    <button
                        className={`profile-tab ${activeTab === 'checkedout' ? 'active' : ''}`}
                        onClick={() => setActiveTab('checkedout')}
                    >
                        🚪 Checked Out
                        <span className="tab-count">{alreadyOut.length}</span>
                    </button>
                </div>

                {/* ── Currently Inside Tab ── */}
                {activeTab === 'inside' && (
                    <>
                        {currentlyInside.length === 0 ? (
                            <div className="empty-state">
                                <p>No visitors currently inside the estate.</p>
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
                                            <th>Checked In</th>
                                            <th>Expected Out</th>
                                            <th>Type</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentlyInside.map((visit) => (
                                            <tr key={visit.visit_id}>
                                                <td>{visit.visitor?.full_name}</td>
                                                <td>{visit.visitor?.phone_number}</td>
                                                <td>
                                                    {visit.tenant?.unit_number} —
                                                    Block {visit.tenant?.block}
                                                </td>
                                                <td>{visit.purpose}</td>
                                                <td>{formatTime(visit.check_in)}</td>
                                                <td>{visit.expected_time_out}</td>
                                                <td>{typeBadge(visit.visit_type)}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => handleCheckOut(visit)}
                                                        disabled={actionLoading === visit.visit_id}
                                                    >
                                                        {actionLoading === visit.visit_id
                                                            ? '...'
                                                            : '🚪 Check Out'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {/* ── Expected Tab ── */}
                {activeTab === 'expected' && (
                    <>
                        {localExpected.length === 0 ? (
                            <div className="empty-state">
                                <p>No visitors expected today.</p>
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
                                            <th>Expected In</th>
                                            <th>Expected Out</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {localExpected.map((visit) => (
                                            <tr key={visit.visit_id}>
                                                <td>{visit.visitor?.full_name}</td>
                                                <td>{visit.visitor?.phone_number}</td>
                                                <td>
                                                    {visit.tenant?.unit_number} —
                                                    Block {visit.tenant?.block}
                                                </td>
                                                <td>{visit.purpose}</td>
                                                <td>{visit.expected_time_in}</td>
                                                <td>{visit.expected_time_out}</td>
                                                <td>
                                                    <span className={statusBadge(visit.status)}>
                                                        {visit.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {/* ── Checked Out Tab ── */}
                {activeTab === 'checkedout' && (
                    <>
                        {alreadyOut.length === 0 ? (
                            <div className="empty-state">
                                <p>No visitors have checked out today.</p>
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
                                            <th>Checked In</th>
                                            <th>Checked Out</th>
                                            <th>Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {alreadyOut.map((visit) => (
                                            <tr key={visit.visit_id}>
                                                <td>{visit.visitor?.full_name}</td>
                                                <td>{visit.visitor?.phone_number}</td>
                                                <td>
                                                    {visit.tenant?.unit_number} —
                                                    Block {visit.tenant?.block}
                                                </td>
                                                <td>{visit.purpose}</td>
                                                <td>{formatTime(visit.check_in)}</td>
                                                <td>{formatTime(visit.check_out)}</td>
                                                <td>{typeBadge(visit.visit_type)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

VisitorList.layout = (page) => <GuardLayout>{page}</GuardLayout>;