import { Head } from "@inertiajs/react";

export default function PendingApproval() {
    return (
        <div className="auth-wrapper">
            <Head title="Pending Approval" />

            <div className="auth-side">
                <div className="auth-side-brand">🏢 SmartVisitor</div>
                <h2>Almost there.</h2>
                <p>
                    Your registration has been received. Estate management will
                    review and approve your account shortly.
                </p>
                <div className="auth-side-list">
                    <div className="auth-side-list-item">
                        <span className="icon">📲</span>
                        You'll receive an SMS the moment you're approved
                    </div>
                    <div className="auth-side-list-item">
                        <span className="icon">🔒</span>
                        Your details are safe and secure
                    </div>
                    <div className="auth-side-list-item">
                        <span className="icon">⏳</span>
                        Approval usually happens within 24 hours
                    </div>
                </div>
            </div>

            <div className="auth-form-side">
                <div className="auth-form-box" style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "3.5rem", marginBottom: "20px" }}>
                        ⏳
                    </div>
                    <h1>Account Pending</h1>
                    <p className="auth-sub" style={{ marginBottom: "32px" }}>
                        Your registration has been submitted successfully. You
                        will receive an SMS notification on your registered
                        phone number once an admin approves your account.
                    </p>
                    <a
                        href="/"
                        className="auth-submit-btn"
                        style={{
                            display: "inline-block",
                            textDecoration: "none",
                        }}
                    >
                        ← Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}
