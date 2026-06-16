import { Head, Link, usePage } from '@inertiajs/react';
import TenantLayout from '@/Layouts/TenantLayout';

export default function Dashboard({ tenant, stats }) {
    const { auth } = usePage().props;
    return (
        <>
            <Head title="Tenant Dashboard" />

            <div className="dashboard-header">
                {/* <h2>Welcome, {tenant?.unit_number} — Block {tenant?.block}</h2> */}
                <h2>Welcome, {auth.user.name} 👋</h2>
                <p className="text-muted">Unit {tenant?.unit_number} — Block {tenant?.block}</p>
                <p className="text-muted">Here's an overview of your visitor activity</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card stat-blue">
                    <span className="stat-number">{stats.total_visitors}</span>
                    <span className="stat-label">Total Visitors</span>
                </div>
                <div className="stat-card stat-yellow">
                    <span className="stat-number">{stats.pending}</span>
                    <span className="stat-label">Pending</span>
                </div>
                <div className="stat-card stat-green">
                    <span className="stat-number">{stats.checked_in}</span>
                    <span className="stat-label">Checked In</span>
                </div>
                <div className="stat-card stat-gray">
                    <span className="stat-number">{stats.checked_out}</span>
                    <span className="stat-label">Checked Out</span>
                </div>
                <div className="stat-card stat-red">
                    <span className="stat-number">{stats.open_incidents}</span>
                    <span className="stat-label">Open Incidents</span>
                </div>
            </div>

            <div className="quick-actions">
                <h5>Quick Actions</h5>
                <div className="action-buttons">
                    <Link href={route('tenant.invite')} className="btn btn-primary">
                        + Invite Visitor
                    </Link>
                    <Link href={route('tenant.visitors')} className="btn btn-outline-secondary">
                        View Visitors
                    </Link>
                    <Link href={route('tenant.report-incident')} className="btn btn-outline-danger">
                        Report Incident
                    </Link>
                </div>
            </div>
        </>
    );
}


Dashboard.layout = (page) => <TenantLayout>{page}</TenantLayout>;