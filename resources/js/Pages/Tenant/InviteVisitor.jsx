// import { Head, useForm, usePage } from '@inertiajs/react';
// import InputError from '@/Components/InputError';
// import InputLabel from '@/Components/InputLabel';
// import TextInput from '@/Components/TextInput';
// import QRCode from 'react-qr-code';
// import TenantLayout from '@/Layouts/TenantLayout';

// export default function InviteVisitor() {
//     const { flash } = usePage().props;

//     const { data, setData, post, processing, errors, reset } = useForm({
//         full_name:         '',
//         phone_number:      '',
//         id_number:         '',
//         purpose:           '',
//         visit_date:        '',
//         expected_time_in:  '',
//         expected_time_out: '',
//     });

//     const submit = (e) => {
//         e.preventDefault();
//         post(route('tenant.visits.store'), {
//             onSuccess: () => reset(),
//         });
//     };

//     return (
//         <>
//             <Head title="Invite Visitor" />

//             <div className="page-card">
//                 <h4 className="page-title">Invite a Visitor</h4>

//                 {flash?.success && (
//                     <div className="alert alert-success mb-4">{flash.success}</div>
//                 )}

//                 <form onSubmit={submit}>
//                     <div className="form-grid">
//                         <div className="form-group">
//                             <InputLabel htmlFor="full_name" value="Visitor Full Name" />
//                             <TextInput
//                                 id="full_name"
//                                 value={data.full_name}
//                                 className="mt-1 block w-full"
//                                 onChange={(e) => setData('full_name', e.target.value)}
//                                 required
//                             />
//                             <InputError message={errors.full_name} className="mt-2" />
//                         </div>

//                         <div className="form-group">
//                             <InputLabel htmlFor="phone_number" value="Phone Number" />
//                             <TextInput
//                                 id="phone_number"
//                                 type="tel"
//                                 value={data.phone_number}
//                                 className="mt-1 block w-full"
//                                 onChange={(e) => setData('phone_number', e.target.value)}
//                                 required
//                             />
//                             <InputError message={errors.phone_number} className="mt-2" />
//                         </div>

//                         <div className="form-group">
//                             <InputLabel htmlFor="id_number" value="ID / Passport Number" />
//                             <TextInput
//                                 id="id_number"
//                                 value={data.id_number}
//                                 className="mt-1 block w-full"
//                                 onChange={(e) => setData('id_number', e.target.value)}
//                                 required
//                             />
//                             <InputError message={errors.id_number} className="mt-2" />
//                         </div>

//                         <div className="form-group">
//                             <InputLabel htmlFor="purpose" value="Purpose of Visit" />
//                             <TextInput
//                                 id="purpose"
//                                 value={data.purpose}
//                                 className="mt-1 block w-full"
//                                 onChange={(e) => setData('purpose', e.target.value)}
//                                 required
//                             />
//                             <InputError message={errors.purpose} className="mt-2" />
//                         </div>

//                         <div className="form-group">
//                             <InputLabel htmlFor="visit_date" value="Visit Date" />
//                             <TextInput
//                                 id="visit_date"
//                                 type="date"
//                                 value={data.visit_date}
//                                 className="mt-1 block w-full"
//                                 onChange={(e) => setData('visit_date', e.target.value)}
//                                 required
//                             />
//                             <InputError message={errors.visit_date} className="mt-2" />
//                         </div>

//                         <div className="form-group">
//                             <InputLabel htmlFor="expected_time_in" value="Expected Time In" />
//                             <TextInput
//                                 id="expected_time_in"
//                                 type="time"
//                                 value={data.expected_time_in}
//                                 className="mt-1 block w-full"
//                                 onChange={(e) => setData('expected_time_in', e.target.value)}
//                                 required
//                             />
//                             <InputError message={errors.expected_time_in} className="mt-2" />
//                         </div>

//                         <div className="form-group">
//                             <InputLabel htmlFor="expected_time_out" value="Expected Time Out" />
//                             <TextInput
//                                 id="expected_time_out"
//                                 type="time"
//                                 value={data.expected_time_out}
//                                 className="mt-1 block w-full"
//                                 onChange={(e) => setData('expected_time_out', e.target.value)}
//                                 required
//                             />
//                             <InputError message={errors.expected_time_out} className="mt-2" />
//                         </div>
//                     </div>

//                     <div className="mt-4">
//                         <button type="submit" className="btn btn-primary" disabled={processing}>
//                             {processing ? 'Sending Invite...' : 'Invite Visitor'}
//                         </button>
//                     </div>
//                 </form>

//                 {/* QR Code — only shows after successful submission */}
//                 {flash?.qr_token && (
//                     <div className="qr-container">
//                         <h5>✅ Visitor QR Code Generated</h5>
//                         <p className="text-muted">Share this QR code with your visitor to present at the gate</p>
//                         <div style={{ background: 'white', padding: '16px', display: 'inline-block', borderRadius: '8px' }}>
//                             <QRCode value={flash.qr_token} size={200} />
//                         </div>
//                         <p className="qr-token-text">Token: {flash.qr_token}</p>
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// }

// InviteVisitor.layout = (page) => <TenantLayout>{page}</TenantLayout>;

import { Head, useForm, usePage, router } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import QRCode from "react-qr-code";
import TenantLayout from "@/Layouts/TenantLayout";
import { useState } from "react";

export default function InviteVisitor() {
    const { flash } = usePage().props;
    const [qrToken, setQrToken] = useState(null);
    const [purposeOther, setPurposeOther] = useState(false);
    const [successMsg, setSuccessMsg] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        full_name: "",
        phone_number: "",
        id_number: "",
        purpose: "",
        visit_date: "",
        expected_time_in: "",
        expected_time_out: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("tenant.visits.store"), {
            onSuccess: (page) => {
                const token = page.props.flash?.qr_token;
                if (token) {
                    setQrToken(token);
                    setSuccessMsg("Visitor invited successfully.");
                }
                reset();
            },
        });
    };

    return (
        <>
            <Head title="Invite Visitor" />

            <div className="page-card">
                <h4 className="page-title">Invite a Visitor</h4>

                {successMsg && (
                    <div className="alert alert-success mb-4">{successMsg}</div>
                )}

                <form onSubmit={submit}>
                    <div className="form-grid">
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

                        <div className="form-group">
                            <InputLabel
                                htmlFor="visit_date"
                                value="Visit Date"
                            />
                            <TextInput
                                id="visit_date"
                                type="date"
                                value={data.visit_date}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("visit_date", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.visit_date}
                                className="mt-2"
                            />
                        </div>

                        <div className="form-group">
                            <InputLabel
                                htmlFor="expected_time_in"
                                value="Expected Time In"
                            />
                            <TextInput
                                id="expected_time_in"
                                type="time"
                                value={data.expected_time_in}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("expected_time_in", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.expected_time_in}
                                className="mt-2"
                            />
                        </div>

                        <div className="form-group">
                            <InputLabel
                                htmlFor="expected_time_out"
                                value="Expected Time Out"
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

                    <div className="mt-4">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={processing}
                        >
                            {processing
                                ? "Generating..."
                                : "🔲 Generate QR & Invite"}
                        </button>
                    </div>
                </form>

                {/* QR Code — renders from React state, not flash */}
                {qrToken && (
                    <div className="qr-container">
                        <h5>✅ Visitor QR Code Generated</h5>
                        <p className="text-muted">
                            Download and send this QR code to your visitor —
                            they'll present it at the gate
                        </p>

                        {/* Render QR visibly */}
                        <div
                            id="qr-code-block"
                            style={{
                                background: "white",
                                padding: "16px",
                                display: "inline-block",
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                            }}
                        >
                            <QRCode
                                value={qrToken}
                                size={200}
                                id="visitor-qr"
                            />
                        </div>

                        <p className="qr-token-text">Token: {qrToken}</p>

                        <div className="d-flex gap-2 justify-content-center mt-3 flex-wrap">
                            {/* Download button */}
                            <button
                                className="btn btn-success btn-sm"
                                onClick={() => {
                                    // Find the SVG and convert to downloadable PNG
                                    const svg =
                                        document.querySelector(
                                            "#qr-code-block svg",
                                        );
                                    const svgData =
                                        new XMLSerializer().serializeToString(
                                            svg,
                                        );
                                    const canvas =
                                        document.createElement("canvas");
                                    canvas.width = 250;
                                    canvas.height = 250;
                                    const ctx = canvas.getContext("2d");
                                    const img = new Image();
                                    img.onload = () => {
                                        ctx.fillStyle = "white";
                                        ctx.fillRect(0, 0, 250, 250);
                                        ctx.drawImage(img, 0, 0, 250, 250);
                                        const link =
                                            document.createElement("a");
                                        link.download = `visitor-qr-${qrToken.slice(0, 8)}.png`;
                                        link.href =
                                            canvas.toDataURL("image/png");
                                        link.click();
                                    };
                                    img.src =
                                        "data:image/svg+xml;base64," +
                                        btoa(svgData);
                                }}
                            >
                                ⬇️ Download QR
                            </button>

                            {/* Dismiss button */}
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => setQrToken(null)}
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

InviteVisitor.layout = (page) => <TenantLayout>{page}</TenantLayout>;
