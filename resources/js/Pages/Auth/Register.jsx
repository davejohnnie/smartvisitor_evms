import InputError from "@/Components/InputError";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone_number: "",
        unit_number: "",
        block: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="auth-wrapper">
            <Head title="Register" />

            <div className="auth-side">
                <div className="auth-side-brand">🏢 SmartVisitor</div>
                <h2>Set up your unit in under two minutes.</h2>
                <p>
                    Register once as a tenant, then invite every visitor from
                    your dashboard.
                </p>
                <div className="auth-side-list">
                    <div className="auth-side-list-item">
                        <span className="icon">⚡</span> Quick and easy setup
                    </div>
                    <div className="auth-side-list-item">
                        <span className="icon">🔒</span> Your unit details stay
                        private
                    </div>
                    <div className="auth-side-list-item">
                        <span className="icon">✅</span> Guards verify visitors
                        instantly
                    </div>
                </div>
            </div>

            <div className="auth-form-side">
                <div className="auth-form-box">
                    <a href="/" className="auth-back-home">
                        ← Back to home
                    </a>

                    <h1>Register as a Tenant</h1>
                    <p className="auth-sub">
                        Create your account to start managing visitors.
                    </p>

                    <form onSubmit={submit}>
                        <div>
                            <label htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                value={data.name}
                                autoComplete="name"
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                autoComplete="username"
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
                            <label htmlFor="phone_number">Phone Number</label>
                            <input
                                id="phone_number"
                                type="tel"
                                value={data.phone_number}
                                onChange={(e) =>
                                    setData("phone_number", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.phone_number}
                                className="mt-2"
                            />
                        </div>

                        <div style={{ display: "flex", gap: "14px" }}>
                            <div style={{ flex: 1 }}>
                                <label htmlFor="unit_number">Unit Number</label>
                                <input
                                    id="unit_number"
                                    type="text"
                                    value={data.unit_number}
                                    placeholder="e.g. A101"
                                    onChange={(e) =>
                                        setData("unit_number", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.unit_number}
                                    className="mt-2"
                                />
                            </div>

                            <div style={{ flex: 1 }}>
                                <label htmlFor="block">Block</label>
                                <input
                                    id="block"
                                    type="text"
                                    value={data.block}
                                    placeholder="e.g. A"
                                    onChange={(e) =>
                                        setData("block", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.block}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password">Password</label>
                            <div style={{ position: "relative" }}>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    autoComplete="new-password"
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

                        <div>
                            <label htmlFor="password_confirmation">
                                Confirm Password
                            </label>
                            <div style={{ position: "relative" }}>
                                <input
                                    id="password_confirmation"
                                    type={
                                        showPasswordConfirm
                                            ? "text"
                                            : "password"
                                    }
                                    value={data.password_confirmation}
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value,
                                        )
                                    }
                                    required
                                    style={{ paddingRight: "48px" }}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPasswordConfirm((v) => !v)
                                    }
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
                                    {showPasswordConfirm
                                        ? "🔒 Hide"
                                        : "👁 Show"}
                                </button>
                            </div>
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={processing}
                        >
                            {processing ? "Creating account..." : "Register"}
                        </button>
                    </form>

                    <div className="auth-footer-link">
                        Already registered? <a href="/login">Log in</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
