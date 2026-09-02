import InputError from "@/Components/InputError";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";


export default function Login({ status }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="auth-wrapper">
            <Head title="Log in" />

            <div className="auth-side">
                <div className="auth-side-brand">🏢 SmartVisitor</div>
                <h2>Your gate, accounted for — every single day.</h2>
                <p>
                    Log in to invite visitors, check the gate log, or manage
                    your estate.
                </p>
                <div className="auth-side-list">
                    <div className="auth-side-list-item">
                        <span className="icon">📷</span> Scan QR invites in seconds
                    </div>
                    <div className="auth-side-list-item">
                        <span className="icon">📲</span> SMS the moment your
                        visitor arrives
                    </div>
                    <div className="auth-side-list-item">
                        <span className="icon">📊</span> Realtime gate activity
                    </div>
                </div>
            </div>

            <div className="auth-form-side">
                <div className="auth-form-box">
                    <a href="/" className="auth-back-home">
                        ← Back to home
                    </a>

                    <h1>Welcome back</h1>
                    <p className="auth-sub">
                        Log in to continue to your dashboard.
                    </p>

                    {status && (
                        <div className="alert alert-success mb-3">{status}</div>
                    )}

                    <form onSubmit={submit}>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                autoComplete="username"
                                autoFocus
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <label htmlFor="password">Password</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    required
                                    style={{ paddingRight: "48px" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    style={{
                                        position: "absolute",
                                        right: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: "0.85rem",
                                    }}
                                    tabIndex={-1}
                                >
                                    {showPassword ? "🔒 Hide" : "👁 Show"}
                                </button>
                            </div>
                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={processing}
                        >
                            {processing ? "Logging in..." : "Log In"}
                        </button>
                    </form>

                    <div className="auth-footer-link">
                        Don't have an account?{" "}
                        <a href="/register">Register as a Tenant</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
