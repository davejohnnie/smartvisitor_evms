import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function TenantManagement({ activeTenants = [], pendingTenants = [], rejectedTenants = [] }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState(
        pendingTenants.length > 0 ? 'pending' : 'active'
    );

    const handleApprove = (id, name) => {
        if (confirm(`Approve ${name}'s account?`)) {
            router.patch(route('admin.tenants.approve', id));
        }
    };

    const handleReject = (id, name) => {
        if (confirm(`Reject ${name}'s registration?`)) {
            router.patch(route('admin.tenants.reject', id));
        }
    };

    const formatDate = (d) =>
        new Date(d).toLocaleDateString('en-KE', { dateStyle: 'medium' });

    return (
        <>
            <Head title="Tenant Management" />

            <div className="page-card">
                <h4 className="page-title">🏠 Tenant Management</h4>

                {flash?.success && (
                    <div className="alert alert-success mb-4">{flash.success}</div>
                )}
                {flash?.error && (
                    <div className="alert alert-danger mb-4">{flash.error}</div>
                )}

                {/* Summary Cards */}
                <div className="stats-grid mb-4">
                    <div className="stat-card stat-green">
                        <span className="stat-number">{activeTenants.length}</span>
                        <span className="stat-label">Active Tenants</span>
                    </div>
                    <div className="stat-card stat-yellow">
                        <span className="stat-number">{pendingTenants.length}</span>
                        <span className="stat-label">Pending Approval</span>
                    </div>
                    <div className="stat-card stat-red">
                        <span className="stat-number">{rejectedTenants.length}</span>
                        <span className="stat-label">Rejected</span>
                    </div>
                    <div className="stat-card stat-blue">
                        <span className="stat-number">
                            {activeTenants.length + pendingTenants.length + rejectedTenants.length}
                        </span>
                        <span className="stat-label">Total Registered</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="profile-tabs mb-4">
                    <button
                        className={`profile-tab ${activeTab === 'active' ? 'active' : ''}`}
                        onClick={() => setActiveTab('active')}
                    >
                        ✅ Active
                        <span className="tab-count">{activeTenants.length}</span>
                    </button>
                    <button
                        className={`profile-tab ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        ⏳ Pending
                        <span className="tab-count">{pendingTenants.length}</span>
                    </button>
                    <button
                        className={`profile-tab ${activeTab === 'rejected' ? 'active' : ''}`}
                        onClick={() => setActiveTab('rejected')}
                    >
                        ❌ Rejected
                        <span className="tab-count">{rejectedTenants.length}</span>
                    </button>
                </div>

                {/* ── Active Tab ── */}
                {activeTab === 'active' && (
                    <>
                        {activeTenants.length === 0 ? (
                            <div className="empty-state">
                                <p>No active tenants yet.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table sv-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Unit</th>
                                            <th>Block</th>
                                            <th>Lease Start</th>
                                            <th>Registered</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeTenants.map((tenant) => (
                                            <tr key={tenant.u_id}>
                                                <td>{tenant.name}</td>
                                                <td>{tenant.email}</td>
                                                <td>{tenant.tenant?.phone_number}</td>
                                                <td>
                                                    <span className="badge bg-light text-dark border">
                                                        {tenant.tenant?.unit_number}
                                                    </span>
                                                </td>
                                                <td>{tenant.tenant?.block}</td>
                                                <td>{tenant.tenant?.lease_start ?? '—'}</td>
                                                <td>{formatDate(tenant.created_at)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {/* ── Pending Tab ── */}
                {activeTab === 'pending' && (
                    <>
                        {pendingTenants.length === 0 ? (
                            <div className="empty-state">
                                <p>No pending registrations — all caught up. ✅</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table sv-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Unit</th>
                                            <th>Block</th>
                                            <th>Registered</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingTenants.map((tenant) => (
                                            <tr key={tenant.u_id}>
                                                <td>{tenant.name}</td>
                                                <td>{tenant.email}</td>
                                                <td>{tenant.tenant?.phone_number}</td>
                                                <td>
                                                    <span className="badge bg-light text-dark border">
                                                        {tenant.tenant?.unit_number}
                                                    </span>
                                                </td>
                                                <td>{tenant.tenant?.block}</td>
                                                <td>{formatDate(tenant.created_at)}</td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() => handleApprove(tenant.u_id, tenant.name)}
                                                        >
                                                            ✅ Approve
                                                        </button>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleReject(tenant.u_id, tenant.name)}
                                                        >
                                                            ❌ Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {/* ── Rejected Tab ── */}
                {activeTab === 'rejected' && (
                    <>
                        {rejectedTenants.length === 0 ? (
                            <div className="empty-state">
                                <p>No rejected registrations.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table sv-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Unit</th>
                                            <th>Block</th>
                                            <th>Registered</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rejectedTenants.map((tenant) => (
                                            <tr key={tenant.u_id}>
                                                <td>
                                                    <span className="text-muted">{tenant.name}</span>
                                                </td>
                                                <td>{tenant.email}</td>
                                                <td>{tenant.tenant?.phone_number}</td>
                                                <td>
                                                    <span className="badge bg-light text-dark border">
                                                        {tenant.tenant?.unit_number}
                                                    </span>
                                                </td>
                                                <td>{tenant.tenant?.block}</td>
                                                <td>{formatDate(tenant.created_at)}</td>
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

TenantManagement.layout = (page) => <AdminLayout>{page}</AdminLayout>;