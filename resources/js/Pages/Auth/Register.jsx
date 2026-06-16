import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name:         '',
        email:        '',
        password:     '',
        password_confirmation: '',
        phone_number: '',
        unit_number:  '',
        block:        '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                {/* Name */}
                <div>
                    <InputLabel htmlFor="name" value="Full Name" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                {/* Email */}
                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Phone Number */}
                <div className="mt-4">
                    <InputLabel htmlFor="phone_number" value="Phone Number" />
                    <TextInput
                        id="phone_number"
                        type="tel"
                        name="phone_number"
                        value={data.phone_number}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('phone_number', e.target.value)}
                        required
                    />
                    <InputError message={errors.phone_number} className="mt-2" />
                </div>

                {/* Unit Number + Block side by side */}
                <div className="mt-4 flex gap-4">
                    <div className="flex-1">
                        <InputLabel htmlFor="unit_number" value="Unit Number" />
                        <TextInput
                            id="unit_number"
                            name="unit_number"
                            value={data.unit_number}
                            className="mt-1 block w-full"
                            placeholder="e.g. A101"
                            onChange={(e) => setData('unit_number', e.target.value)}
                            required
                        />
                        <InputError message={errors.unit_number} className="mt-2" />
                    </div>

                    <div className="flex-1">
                        <InputLabel htmlFor="block" value="Block" />
                        <TextInput
                            id="block"
                            name="block"
                            value={data.block}
                            className="mt-1 block w-full"
                            placeholder="e.g. A"
                            onChange={(e) => setData('block', e.target.value)}
                            required
                        />
                        <InputError message={errors.block} className="mt-2" />
                    </div>
                </div>

                {/* Password */}
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Confirm Password */}
                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                {/* Submit */}
                <div className="mt-4 flex items-center justify-between">
                    <Link
                        href={route('login')}
                        className="text-sm text-gray-600 underline hover:text-gray-900"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}