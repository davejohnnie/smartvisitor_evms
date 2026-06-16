import { Head } from '@inertiajs/react';
import GuardLayout from '@/Layouts/GuardLayout';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

export default function ScanQr() {
    const [scanning, setScanning]           = useState(false);
    const [result, setResult]               = useState(null);
    const [error, setError]                 = useState(null);
    const [actionMsg, setActionMsg]         = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [manualToken, setManualToken]     = useState('');
    const [activeTab, setActiveTab]         = useState('camera');
    const html5QrRef = useRef(null);

    // Get XSRF token from cookie
    const getXsrfToken = () => {
        return decodeURIComponent(
            document.cookie
                .split('; ')
                .find((r) => r.startsWith('XSRF-TOKEN='))
                ?.split('=')[1] || ''
        );
    };

    const verifyToken = async (token) => {
        try {
            const response = await axios.post(
                route('guard.visits.verify-qr'),
                { qr_token: token },
                { headers: { 'X-XSRF-TOKEN': getXsrfToken() } }
            );
            setResult(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to verify QR code.');
            setResult(null);
        }
    };

    const startScanner = async () => {
        setResult(null);
        setError(null);
        setActionMsg(null);

        // Small delay to ensure the div is rendered in the DOM
        setTimeout(async () => {
            try {
                const html5Qr = new Html5Qrcode('qr-reader', {
                    formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
                    verbose: false,
                });
                html5QrRef.current = html5Qr;

                // Try rear camera first, fall back to front camera (PC)
                try {
                    await html5Qr.start(
                        { facingMode: 'environment' },
                        { fps: 10, qrbox: { width: 250, height: 250 } },
                        async (decodedText) => {
                            await html5Qr.stop();
                            html5QrRef.current = null;
                            setScanning(false);
                            await verifyToken(decodedText);
                        },
                        () => {}
                    );
                } catch {
                    // Fall back to front-facing camera (PC/laptop)
                    await html5Qr.start(
                        { facingMode: 'user' },
                        { fps: 10, qrbox: { width: 250, height: 250 } },
                        async (decodedText) => {
                            await html5Qr.stop();
                            html5QrRef.current = null;
                            setScanning(false);
                            await verifyToken(decodedText);
                        },
                        () => {}
                    );
                }

                setScanning(true);
            } catch (err) {
                setError('Could not access camera. Please allow camera permissions or use manual entry below.');
                setScanning(false);
            }
        }, 100);
    };

    const stopScanner = async () => {
        if (html5QrRef.current) {
            try {
                await html5QrRef.current.stop();
                html5QrRef.current.clear();
                html5QrRef.current = null;
            } catch {}
        }
        setScanning(false);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (html5QrRef.current) {
                html5QrRef.current.stop().catch(() => {});
            }
        };
    }, []);

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        if (!manualToken.trim()) return;
        setResult(null);
        setError(null);
        setActionMsg(null);
        await verifyToken(manualToken.trim());
        setManualToken('');
    };

    const handleCheckIn = async (visitId) => {
        setActionLoading(true);
        try {
            const res = await axios.patch(
                route('guard.visits.check-in', visitId),
                {},
                { headers: { 'X-XSRF-TOKEN': getXsrfToken() } }
            );
            setActionMsg({ type: 'success', text: res.data.message });
            setResult((prev) => ({
                ...prev,
                visit: { ...prev.visit, status: 'checked-in' },
            }));
        } catch (err) {
            setActionMsg({
                type: 'error',
                text: err.response?.data?.message || 'Check-in failed.',
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleCheckOut = async (visitId) => {
        setActionLoading(true);
        try {
            const res = await axios.patch(
                route('guard.visits.check-out', visitId),
                {},
                { headers: { 'X-XSRF-TOKEN': getXsrfToken() } }
            );
            setActionMsg({ type: 'success', text: res.data.message });
            setResult((prev) => ({
                ...prev,
                visit: { ...prev.visit, status: 'checked-out' },
            }));
        } catch (err) {
            setActionMsg({
                type: 'error',
                text: err.response?.data?.message || 'Check-out failed.',
            });
        } finally {
            setActionLoading(false);
        }
    };

    const resetAll = () => {
        setResult(null);
        setError(null);
        setActionMsg(null);
        setManualToken('');
    };

    const formatTime = (t) =>
        t ? new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—';

    const statusBadge = (status) => {
        const map = {
            'pending':     'badge bg-warning text-dark',
            'checked-in':  'badge bg-success',
            'checked-out': 'badge bg-secondary',
        };
        return map[status] || 'badge bg-light';
    };

    return (
        <>
            <Head title="Scan QR Code" />

            <div className="page-card">
                <h4 className="page-title">📷 Verify Visitor</h4>
                <p className="text-muted mb-4">
                    Scan the visitor's QR code or enter the token manually.
                </p>

                {/* Input Method Tabs */}
                <div className="profile-tabs mb-4">
                    <button
                        className={`profile-tab ${activeTab === 'camera' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('camera'); stopScanner(); resetAll(); }}
                    >
                        📷 Camera Scan
                    </button>
                    <button
                        className={`profile-tab ${activeTab === 'manual' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('manual'); stopScanner(); resetAll(); }}
                    >
                        ⌨️ Manual Entry
                    </button>
                </div>

                {/* ── Camera Tab ── */}
                {activeTab === 'camera' && (
                    <div>
                        <div className="d-flex gap-2 mb-4">
                            {!scanning ? (
                                <button className="btn btn-success" onClick={startScanner}>
                                    📷 Start Camera
                                </button>
                            ) : (
                                <button className="btn btn-danger" onClick={stopScanner}>
                                    ⏹ Stop Camera
                                </button>
                            )}
                            {(result || error) && (
                                <button className="btn btn-outline-secondary" onClick={resetAll}>
                                    🔄 Scan Another
                                </button>
                            )}
                        </div>

                        {/* Camera viewfinder */}
                        <div
                            id="qr-reader"
                            style={{ display: scanning ? 'block' : 'none', marginBottom: '20px' }}
                        />

                        {!scanning && !result && !error && (
                            <div className="scanner-placeholder">
                                <span className="scanner-placeholder-icon">📷</span>
                                <p>Camera is off — press <strong>Start Camera</strong> to begin</p>
                                <small className="text-muted">
                                    On a PC, your front-facing webcam will be used
                                </small>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Manual Entry Tab ── */}
                {activeTab === 'manual' && (
                    <div>
                        <p className="text-muted mb-3">
                            Ask the visitor to show their QR token text, or copy it from
                            the invitation. Paste it below to verify.
                        </p>
                        <form onSubmit={handleManualSubmit} className="d-flex gap-2 mb-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Paste QR token here..."
                                value={manualToken}
                                onChange={(e) => setManualToken(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn btn-success text-nowrap">
                                ✅ Verify
                            </button>
                        </form>
                        {(result || error) && (
                            <button className="btn btn-outline-secondary btn-sm mb-4" onClick={resetAll}>
                                🔄 Verify Another
                            </button>
                        )}
                    </div>
                )}

                {/* ── Error State ── */}
                {error && (
                    <div className="alert alert-danger">❌ {error}</div>
                )}

                {/* ── Action Message ── */}
                {actionMsg && (
                    <div className={`alert ${actionMsg.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                        {actionMsg.type === 'success' ? '✅' : '❌'} {actionMsg.text}
                    </div>
                )}

                {/* ── Visit Result Card ── */}
                {result?.valid && result?.visit && (
                    <div className="visit-result-card">
                        <div className="visit-result-header">
                            <h5>✅ Valid Invitation</h5>
                            <span className={statusBadge(result.visit.status)}>
                                {result.visit.status}
                            </span>
                        </div>

                        <div className="visit-result-grid">
                            <div className="visit-result-section">
                                <h6 className="section-label">👤 Visitor Details</h6>
                                <div className="result-item">
                                    <span className="result-label">Name</span>
                                    <span className="result-value">{result.visit.visitor?.full_name}</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Phone</span>
                                    <span className="result-value">{result.visit.visitor?.phone_number}</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">ID Number</span>
                                    <span className="result-value">{result.visit.visitor?.id_number}</span>
                                </div>
                            </div>

                            <div className="visit-result-section">
                                <h6 className="section-label">🏢 Visit Details</h6>
                                <div className="result-item">
                                    <span className="result-label">Tenant</span>
                                    <span className="result-value">{result.visit.tenant?.user?.name}</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Unit</span>
                                    <span className="result-value">
                                        {result.visit.tenant?.unit_number} — Block {result.visit.tenant?.block}
                                    </span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Purpose</span>
                                    <span className="result-value">{result.visit.purpose}</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Expected In</span>
                                    <span className="result-value">{result.visit.expected_time_in}</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Expected Out</span>
                                    <span className="result-value">{result.visit.expected_time_out}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="d-flex gap-2 mt-4">
                            {result.visit.status === 'pending' && (
                                <button
                                    className="btn btn-success flex-fill"
                                    onClick={() => handleCheckIn(result.visit.visit_id)}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? 'Processing...' : '✅ Check In Visitor'}
                                </button>
                            )}

                            {result.visit.status === 'checked-in' && (
                                <>
                                    <div className="alert alert-success flex-fill mb-0">
                                        ✅ Checked in at {formatTime(result.visit.check_in)}
                                    </div>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => handleCheckOut(result.visit.visit_id)}
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? 'Processing...' : '🚪 Check Out'}
                                    </button>
                                </>
                            )}

                            {result.visit.status === 'checked-out' && (
                                <div className="alert alert-secondary flex-fill mb-0">
                                    🚪 Visitor checked out at {formatTime(result.visit.check_out)}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

ScanQr.layout = (page) => <GuardLayout>{page}</GuardLayout>;