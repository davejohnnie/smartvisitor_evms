import { Head, useForm, usePage } from "@inertiajs/react";
import GuardLayout from "@/Layouts/GuardLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { useState } from "react";

export default function RegisterWalkIn({ tenants }) {
    const { flash } = usePage().props;
    const [purposeOther, setPurposeOther] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        full_name: "",
        phone_number: "",
        id_number: "",
        purpose: "",
        tenant_id: "",
        expected_time_out: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("guard.visitors.walk-in"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="Register Walk-in Visitor" />

            <div className="page-card">
                <h4 className="page-title">✍️ Register Walk-in Visitor</h4>
                <p className="text-muted mb-4">
                    Fill in the visitor's details and select the tenant they are
                    visiting. They will be checked in immediately.
                </p>

                {flash?.success && (
                    <div className="alert alert-success mb-4">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="form-grid">
                        {/* Full Name */}
                        <div className="form-group">
                            <InputLabel
                                htmlFor="full_name"
                                value="Visitor Full Name"
                            />
                            <TextInput
                                id="full_name"
                                value={data.full_name}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("full_name", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.full_name}
                                className="mt-2"
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="form-group">
                            <InputLabel
                                htmlFor="phone_number"
                                value="Phone Number"
                            />
                            <TextInput
                                id="phone_number"
                                type="tel"
                                value={data.phone_number}
                                className="mt-1 block w-full"
                                maxLength={10}
                                onKeyPress={(e) =>
                                    !/[0-9]/.test(e.key) && e.preventDefault()
                                }
                                onChange={(e) =>
                                    setData(
                                        "phone_number",
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 10),
                                    )
                                }
                                required
                            />
                            <small className="text-muted">
                                {data.phone_number.length}/10 digits
                            </small>
                            <InputError
                                message={errors.phone_number}
                                className="mt-2"
                            />
                        </div>

                        {/* ID Number */}
                        <div className="form-group">
                            <InputLabel
                                htmlFor="id_number"
                                value="ID / Passport Number"
                            />
                            <TextInput
                                id="id_number"
                                value={data.id_number}
                                className="mt-1 block w-full"
                                maxLength={12}
                                onKeyPress={(e) =>
                                    !/[0-9]/.test(e.key) && e.preventDefault()
                                }
                                onChange={(e) =>
                                    setData(
                                        "id_number",
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 12),
                                    )
                                }
                                required
                            />
                            <small className="text-muted">
                                {data.id_number.length}/12 digits
                            </small>
                            <InputError
                                message={errors.id_number}
                                className="mt-2"
                            />
                        </div>

                        {/* Tenant Selection */}
                        <div className="form-group">
                            <InputLabel
                                htmlFor="tenant_id"
                                value="Visiting (Tenant / Unit)"
                            />
                            <select
                                id="tenant_id"
                                className="form-select mt-1"
                                value={data.tenant_id}
                                onChange={(e) =>
                                    setData("tenant_id", e.target.value)
                                }
                                required
                            >
                                <option value="">— Select Tenant Unit —</option>
                                {tenants.map((tenant) => (
                                    <option
                                        key={tenant.t_id}
                                        value={tenant.t_id}
                                    >
                                        {tenant.label}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.tenant_id}
                                className="mt-2"
                            />
                        </div>

                        {/* Purpose */}
                        <div className="form-group">
                            <InputLabel
                                htmlFor="purpose"
                                value="Purpose of Visit"
                            />
                            <select
                                id="purpose_select"
                                className="form-select mt-1"
                                onChange={(e) => {
                                    if (e.target.value === "other") {
                                        setData("purpose", "");
                                    } else {
                                        setData("purpose", e.target.value);
                                    }
                                    setPurposeOther(e.target.value === "other");
                                }}
                            >
                                <option value="">— Select Purpose —</option>
                                <option value="Family Visit">
                                    Family Visit
                                </option>
                                <option value="Friend Visit">
                                    Friend Visit
                                </option>
                                <option value="Delivery">Delivery</option>
                                <option value="Plumber">Plumber</option>
                                <option value="Electrician">Electrician</option>
                                <option value="Contractor">Contractor</option>
                                <option value="other">Other (specify)</option>
                            </select>
                            {purposeOther && (
                                <TextInput
                                    id="purpose"
                                    value={data.purpose}
                                    className="mt-2 block w-full"
                                    placeholder="Describe the purpose of visit..."
                                    onChange={(e) =>
                                        setData("purpose", e.target.value)
                                    }
                                    required
                                />
                            )}
                            <InputError
                                message={errors.purpose}
                                className="mt-2"
                            />
                        </div>
                        {/* Expected Time Out */}
                        <div className="form-group">
                            <InputLabel
                                htmlFor="expected_time_out"
                                value="Expected Check-out Time"
                            />
                            <TextInput
                                id="expected_time_out"
                                type="time"
                                value={data.expected_time_out}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("expected_time_out", e.target.value)
                                }
                                required
                            />
                            
                            <InputError
                                message={errors.expected_time_out}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {/* Walk-in notice */}
                    <div className="alert alert-info mt-4">
                        ℹ️ Walk-in visitors are{" "}
                        <strong>checked in immediately</strong> upon
                        registration.
                    </div>

                    <div className="mt-3">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={processing}
                        >
                            {processing
                                ? "Registering..."
                                : "✍️ Register & Check In"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

RegisterWalkIn.layout = (page) => <GuardLayout>{page}</GuardLayout>;
