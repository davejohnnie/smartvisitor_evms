import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function TenantLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="sv-wrapper">
            {/* Sidebar */}
            <aside className={`sv-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sv-brand">
                    <span className="brand-icon">🏢</span>
                    {sidebarOpen && <span className="brand-name">SmartVisitor</span>}
                </div>

                <nav className="sv-nav">
                    <Link href={route('tenant.dashboard')} className="sv-nav-link">
                        <span className="nav-icon">📊</span>
                        {sidebarOpen && <span>Dashboard</span>}
                    </Link>
                    <Link href={route('tenant.invite')} className="sv-nav-link">
                        <span className="nav-icon">➕</span>
                        {sidebarOpen && <span>Invite Visitor</span>}
                    </Link>
                    <Link href={route('tenant.visitors')} className="sv-nav-link">
                        <span className="nav-icon">👥</span>
                        {sidebarOpen && <span>My Visitors</span>}
                    </Link>
                    <Link href={route('tenant.report-incident')} className="sv-nav-link">
                        <span className="nav-icon">⚠️</span>
                        {sidebarOpen && <span>Report Incident</span>}
                    </Link>
                    <Link href={route('tenant.profile')} className="sv-nav-link">
                        <span className="nav-icon">👤</span>
                        {sidebarOpen && <span>Profile</span>}
                    </Link>
                </nav>

                <div className="sv-sidebar-footer">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="sv-logout-btn"
                    >
                        <span className="nav-icon">🚪</span>
                        {sidebarOpen && <span>Logout</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="sv-main">
                {/* Topbar */}
                <header className="sv-topbar">
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        ☰
                    </button>
                    <div className="topbar-user">
                        <span>👤 {auth.user.name}</span>
                        <span className="role-badge tenant-badge">Tenant</span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="sv-content">
                    {children}
                </main>
            </div>
        </div>
    );
}