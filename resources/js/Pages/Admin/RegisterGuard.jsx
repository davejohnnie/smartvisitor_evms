import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function RegisterGuard() {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name:                   '',
        email:                  '',
        password:               '',
        password_confirmation:  '',
        phone_number:           '',
        badge_number:           '',
        shift:                  '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.guards.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <Head title="Register Guard" />

            <div className="page-card">
                <h4 className="page-title">🛡️ Register New Guard</h4>
                <p className="text-muted mb-4">
                    Create login credentials and assign duty details for a new security guard.
                </p>

                {flash?.success && (
                    <div className="alert alert-success mb-4">{flash.success}</div>
                )}

                <form onSubmit={submit}>
                    <div className="form-grid">

                        {/* Name */}
                        <div className="form-group">
                            <InputLabel htmlFor="name" value="Full Name" />
                            <TextInput
                                id="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Phone Number */}
                        <div className="form-group">
                            <InputLabel htmlFor="phone_number" value="Phone Number" />
                            <TextInput
                                id="phone_number"
                                type="tel"
                                value={data.phone_number}
                                className="mt-1 block w-full"
                                maxLength={10}
                                onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                                onChange={(e) => setData('phone_number', e.target.value.replace(/\D/g, '').slice(0, 10))}
                                required
                            />
                            <small className="text-muted">{data.phone_number.length}/10 digits</small>
                            <InputError message={errors.phone_number} className="mt-2" />
                        </div>

                        {/* Badge Number */}
                        <div className="form-group">
                            <InputLabel htmlFor="badge_number" value="Badge Number" />
                            <TextInput
                                id="badge_number"
                                value={data.badge_number}
                                className="mt-1 block w-full"
                                placeholder="e.g. BADGE002"
                                onChange={(e) => setData('badge_number', e.target.value)}
                                required
                            />
                            <InputError message={errors.badge_number} className="mt-2" />
                        </div>

                        {/* Shift */}
                        <div className="form-group">
                            <InputLabel htmlFor="shift" value="Shift" />
                            <select
                                id="shift"
                                className="form-select mt-1"
                                value={data.shift}
                                onChange={(e) => setData('shift', e.target.value)}
                                required
                            >
                                <option value="">— Select Shift —</option>
                                <option value="Morning (6AM - 2PM)">Morning (6AM - 2PM)</option>
                                <option value="Afternoon (2PM - 10PM)">Afternoon (2PM - 10PM)</option>
                                <option value="Night (10PM - 6AM)">Night (10PM - 6AM)</option>
                            </select>
                            <InputError message={errors.shift} className="mt-2" />
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Confirm Password */}
                        <div className="form-group">
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-4">
                        <button type="submit" className="btn btn-primary" disabled={processing}>
                            {processing ? 'Registering...' : '🛡️ Register Guard'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

RegisterGuard.layout = (page) => <AdminLayout>{page}</AdminLayout>;