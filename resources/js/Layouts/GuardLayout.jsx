import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function GuardLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="sv-wrapper">
            {/* Sidebar */}
            <aside className={`sv-sidebar guard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sv-brand">
                    <span className="brand-icon">🛡️</span>
                    {sidebarOpen && <span className="brand-name">SmartVisitor</span>}
                </div>

                <nav className="sv-nav">
                    <Link href={route('guard.dashboard')} className="sv-nav-link">
                        <span className="nav-icon">📊</span>
                        {sidebarOpen && <span>Dashboard</span>}
                    </Link>
                    <Link href={route('guard.scan')} className="sv-nav-link">
                        <span className="nav-icon">📷</span>
                        {sidebarOpen && <span>Scan QR</span>}
                    </Link>
                    <Link href={route('guard.walk-in')} className="sv-nav-link">
                        <span className="nav-icon">✍️</span>
                        {sidebarOpen && <span>Register Walk-in</span>}
                    </Link>
                    <Link href={route('guard.visitors')} className="sv-nav-link">
                        <span className="nav-icon">👥</span>
                        {sidebarOpen && <span>Visitor List</span>}
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
                        <span>🛡️ {auth.user.name}</span>
                        <span className="role-badge guard-badge">Guard</span>
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