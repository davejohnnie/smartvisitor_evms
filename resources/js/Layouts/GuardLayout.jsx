import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function GuardLayout({ children }) {
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
                className={`sv-sidebar guard-sidebar ${sidebarOpen ? "open" : "closed"}`}
            >
                <div className="sv-brand">
                    <span className="brand-icon">🛡️</span>
                    {sidebarOpen && (
                        <span className="brand-name">SmartVisitor</span>
                    )}
                </div>

                <nav className="sv-nav">
                    <Link
                        href={route("guard.dashboard")}
                        className={`sv-nav-link ${isActive("guard.dashboard") ? "active" : ""}`}
                    >
                        <span className="nav-icon">📊</span>
                        {sidebarOpen && <span>Dashboard</span>}
                    </Link>
                    <Link
                        href={route("guard.scan")}
                        className={`sv-nav-link ${isActive("guard.scan") ? "active" : ""}`}
                    >
                        <span className="nav-icon">📷</span>
                        {sidebarOpen && <span>Scan QR</span>}
                    </Link>
                    <Link
                        href={route("guard.walk-in")}
                        className={`sv-nav-link ${isActive("guard.walk-in") ? "active" : ""}`}
                    >
                        <span className="nav-icon">✍️</span>
                        {sidebarOpen && <span>Register Walk-in</span>}
                    </Link>
                    <Link
                        href={route("guard.visitors")}
                        className={`sv-nav-link ${isActive("guard.visitors") ? "active" : ""}`}
                    >
                        <span className="nav-icon">👥</span>
                        {sidebarOpen && <span>Visitor List</span>}
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
                        <span>🛡️ {auth.user.name}</span>
                        <span className="role-badge guard-badge">Guard</span>
                    </div>
                </header>

                <main className="sv-content">{children}</main>
            </div>
        </div>
    );
}
