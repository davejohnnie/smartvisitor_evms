import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function TenantLayout({ children }) {
    const { auth } = usePage().props;
    const { url: currentUrl } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

    const isActive = (routeName) =>
        currentUrl === route(routeName, undefined, false);

    // Auto-close sidebar on small screens after navigating
    useEffect(() => {
        if (window.innerWidth <= 768) {
            setSidebarOpen(false);
        }
    }, [currentUrl]);

    return (
        <div className="sv-wrapper">
            {/* Mobile backdrop */}
            <div
                className={`sidebar-backdrop ${sidebarOpen ? "show" : ""}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`sv-sidebar ${sidebarOpen ? "open" : "closed"}`}>
                <div className="sv-brand">
                    <span className="brand-icon">🏢</span>
                    {sidebarOpen && (
                        <span className="brand-name">SmartVisitor</span>
                    )}
                </div>

                <nav className="sv-nav">
                    <Link
                        href={route("tenant.dashboard")}
                        className={`sv-nav-link ${isActive("tenant.dashboard") ? "active" : ""}`}
                    >
                        <span className="nav-icon">📊</span>
                        {sidebarOpen && <span>Dashboard</span>}
                    </Link>
                    <Link
                        href={route("tenant.invite")}
                        className={`sv-nav-link ${isActive("tenant.invite") ? "active" : ""}`}
                    >
                        <span className="nav-icon">➕</span>
                        {sidebarOpen && <span>Invite Visitor</span>}
                    </Link>
                    <Link
                        href={route("tenant.visitors")}
                        className={`sv-nav-link ${isActive("tenant.visitors") ? "active" : ""}`}
                    >
                        <span className="nav-icon">👥</span>
                        {sidebarOpen && <span>My Visitors</span>}
                    </Link>
                    <Link
                        href={route("tenant.report-incident")}
                        className={`sv-nav-link ${isActive("tenant.report-incident") ? "active" : ""}`}
                    >
                        <span className="nav-icon">⚠️</span>
                        {sidebarOpen && <span>Report Incident</span>}
                    </Link>
                    <Link
                        href={route("tenant.profile")}
                        className={`sv-nav-link ${isActive("tenant.profile") ? "active" : ""}`}
                    >
                        <span className="nav-icon">👤</span>
                        {sidebarOpen && <span>Profile</span>}
                    </Link>
                </nav>

                <div className="sv-sidebar-footer">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="sv-logout-btn"
                    >
                        <span className="nav-icon">🚪</span>
                        {sidebarOpen && <span>Logout</span>}
                    </Link>
                </div>
            </aside>

            <div className="sv-main">
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

                <main className="sv-content">{children}</main>
            </div>
        </div>
    );
}
