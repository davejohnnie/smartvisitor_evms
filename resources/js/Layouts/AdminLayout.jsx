import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function AdminLayout({ children }) {
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

            <aside
                className={`sv-sidebar admin-sidebar ${sidebarOpen ? "open" : "closed"}`}
            >
                <div className="sv-brand">
                    <span className="brand-icon">⚙️</span>
                    {sidebarOpen && (
                        <span className="brand-name">SmartVisitor</span>
                    )}
                </div>

                <nav className="sv-nav">
                    <Link
                        href={route("admin.dashboard")}
                        className={`sv-nav-link ${isActive("admin.dashboard") ? "active" : ""}`}
                    >
                        <span className="nav-icon">📊</span>
                        {sidebarOpen && <span>Dashboard</span>}
                    </Link>
                    <Link
                        href={route("admin.register-guard")}
                        className={`sv-nav-link ${isActive("admin.register-guard") ? "active" : ""}`}
                    >
                        <span className="nav-icon">🛡️</span>
                        {sidebarOpen && <span>Register Guard</span>}
                    </Link>
                    <Link
                        href={route("admin.guards.index")}
                        className={`sv-nav-link ${isActive("admin.guards.index") ? "active" : ""}`}
                    >
                        <span className="nav-icon">👮</span>
                        {sidebarOpen && <span>Guard List</span>}
                    </Link>
                    <Link
                        href={route("admin.reports")}
                        className={`sv-nav-link ${isActive("admin.reports") ? "active" : ""}`}
                    >
                        <span className="nav-icon">📄</span>
                        {sidebarOpen && <span>Visitor Reports</span>}
                    </Link>
                    <Link
                        href={route("admin.incidents")}
                        className={`sv-nav-link ${isActive("admin.incidents") ? "active" : ""}`}
                    >
                        <span className="nav-icon">⚠️</span>
                        {sidebarOpen && <span>Incidents</span>}
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
                        <span>⚙️ {auth.user.name}</span>
                        <span className="role-badge admin-badge">Admin</span>
                    </div>
                </header>

                <main className="sv-content">{children}</main>
            </div>
        </div>
    );
}
