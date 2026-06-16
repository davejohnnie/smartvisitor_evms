import { Head, useForm } from "@inertiajs/react";
import TenantLayout from "@/Layouts/TenantLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { useState } from 'react';

export default function ReportIncident() {
    const [typeOther, setTypeOther] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        type: "",
        severity: "low",
        details: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("tenant.incidents.store"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="Report Incident" />

            <div className="page-card">
                <h4 className="page-title">Report an Incident</h4>

                <form onSubmit={submit}>
                    <div className="form-grid">
                        {/* Title */}
                        <div className="form-group">
                            <InputLabel
                                htmlFor="title"
                                value="Incident Title"
                            />
                            <TextInput
                                id="title"
                                value={data.title}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.title}
                                className="mt-2"
                            />
                        </div>

                        {/* Type */}
                        <div className="form-group">
                            <InputLabel htmlFor="type" value="Incident Type" />
                            <select
                                id="type_select"
                                className="form-select mt-1"
                                onChange={(e) => {
                                    if (e.target.value === "other") {
                                        setData("type", "");
                                    } else {
                                        setData("type", e.target.value);
                                    }
                                    setTypeOther(e.target.value === "other");
                                }}
                            >
                                <option value="">
                                    — Select Incident Type —
                                </option>
                                <option value="Security">Security</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Noise">Noise</option>
                                <option value="Parking">Parking</option>
                                <option value="other">Other (specify)</option>
                            </select>
                            {typeOther && (
                                <TextInput
                                    id="type"
                                    value={data.type}
                                    className="mt-2 block w-full"
                                    placeholder="Describe the incident type..."
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                    required
                                />
                            )}
                            <InputError
                                message={errors.type}
                                className="mt-2"
                            />
                        </div>

                        {/* Severity */}
                        <div className="form-group">
                            <InputLabel htmlFor="severity" value="Severity" />
                            <select
                                id="severity"
                                value={data.severity}
                                className="form-select mt-1"
                                onChange={(e) =>
                                    setData("severity", e.target.value)
                                }
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                            <InputError
                                message={errors.severity}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {/* Details */}
                    <div className="form-group mt-3">
                        <InputLabel
                            htmlFor="details"
                            value="Incident Details"
                        />
                        <textarea
                            id="details"
                            value={data.details}
                            className="form-control mt-1"
                            rows={5}
                            onChange={(e) => setData("details", e.target.value)}
                            required
                        />
                        <InputError message={errors.details} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <button
                            type="submit"
                            className="btn btn-danger"
                            disabled={processing}
                        >
                            {processing
                                ? "Submitting..."
                                : "Submit Incident Report"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

ReportIncident.layout = (page) => <TenantLayout>{page}</TenantLayout>;
