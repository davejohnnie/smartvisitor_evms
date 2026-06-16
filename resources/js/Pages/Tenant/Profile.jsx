import { Head, useForm, usePage } from '@inertiajs/react';
import TenantLayout from '@/Layouts/TenantLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';

export default function Profile({ user, tenant }) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('info');

    // Profile form
    const profileForm = useForm({
        name:         user.name,
        phone_number: tenant?.phone_number ?? '',
    });

    // Password form
    const passwordForm = useForm({
        current_password:      '',
        password:              '',
        password_confirmation: '',
    });

    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.patch(route('tenant.profile.update'));
    };

    const submitPassword = (e) => {
        e.preventDefault();
        passwordForm.patch(route('tenant.password.update'), {
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <>
            <Head title="My Profile" />

            <div className="page-card">
                <h4 className="page-title">My Profile</h4>

                {flash?.success && (
                    <div className="alert alert-success mb-4">{flash.success}</div>
                )}

                {/* Tabs */}
                <div className="profile-tabs">
                    <button
                        className={`profile-tab ${activeTab === 'info' ? 'active' : ''}`}
                        onClick={() => setActiveTab('info')}
                    >
                        👤 Personal Info
                    </button>
                    <button
                        className={`profile-tab ${activeTab === 'password' ? 'active' : ''}`}
                        onClick={() => setActiveTab('password')}
                    >
                        🔒 Change Password
                    </button>
                </div>

                {/* Personal Info Tab */}
                {activeTab === 'info' && (
                    <div className="profile-tab-content">

                        {/* Read-only info */}
                        <div className="readonly-grid mb-4">
                            <div className="profile-item">
                                <span className="profile-label">Email</span>
                                <span className="profile-value">{user.email}</span>
                                <small className="text-muted">Contact admin to change email</small>
                            </div>
                            <div className="profile-item">
                                <span className="profile-label">Unit Number</span>
                                <span className="profile-value">{tenant?.unit_number}</span>
                            </div>
                            <div className="profile-item">
                                <span className="profile-label">Block</span>
                                <span className="profile-value">{tenant?.block}</span>
                            </div>
                            <div className="profile-item">
                                <span className="profile-label">Lease Start</span>
                                <span className="profile-value">{tenant?.lease_start ?? '—'}</span>
                            </div>
                        </div>

                        <hr />

                        {/* Editable fields */}
                        <h6 className="mt-4 mb-3 fw-semibold">Edit Details</h6>
                        <form onSubmit={submitProfile}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <InputLabel htmlFor="name" value="Full Name" />
                                    <TextInput
                                        id="name"
                                        value={profileForm.data.name}
                                        className="mt-1 block w-full"
                                        onChange={(e) => profileForm.setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={profileForm.errors.name} className="mt-2" />
                                </div>

                                <div className="form-group">
                                    <InputLabel htmlFor="phone_number" value="Phone Number" />
                                    <TextInput
                                        id="phone_number"
                                        type="tel"
                                        value={profileForm.data.phone_number}
                                        className="mt-1 block w-full"
                                        maxLength={10}
                                        onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                                        onChange={(e) => profileForm.setData('phone_number', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        required
                                    />
                                    <InputError message={profileForm.errors.phone_number} className="mt-2" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={profileForm.processing}
                                >
                                    {profileForm.processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Change Password Tab */}
                {activeTab === 'password' && (
                    <div className="profile-tab-content">
                        <h6 className="mb-3 fw-semibold">Change Your Password</h6>
                        <form onSubmit={submitPassword}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <InputLabel htmlFor="current_password" value="Current Password" />
                                    <TextInput
                                        id="current_password"
                                        type="password"
                                        value={passwordForm.data.current_password}
                                        className="mt-1 block w-full"
                                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                        required
                                    />
                                    <InputError message={passwordForm.errors.current_password} className="mt-2" />
                                </div>

                                <div className="form-group">
                                    <InputLabel htmlFor="password" value="New Password" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        value={passwordForm.data.password}
                                        className="mt-1 block w-full"
                                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                                        required
                                    />
                                    <InputError message={passwordForm.errors.password} className="mt-2" />
                                </div>

                                <div className="form-group">
                                    <InputLabel htmlFor="password_confirmation" value="Confirm New Password" />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        value={passwordForm.data.password_confirmation}
                                        className="mt-1 block w-full"
                                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    <InputError message={passwordForm.errors.password_confirmation} className="mt-2" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <button
                                    type="submit"
                                    className="btn btn-warning"
                                    disabled={passwordForm.processing}
                                >
                                    {passwordForm.processing ? 'Updating...' : '🔒 Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}

Profile.layout = (page) => <TenantLayout>{page}</TenantLayout>;