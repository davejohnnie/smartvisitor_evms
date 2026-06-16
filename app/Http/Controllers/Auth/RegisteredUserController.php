<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    // Show registration form
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    // Handle registration form submission
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name'         => 'required|string|max:100',
            'email'        => 'required|string|email|max:100|unique:users,email',
            'password'     => ['required', 'confirmed', Rules\Password::defaults()],
            'phone_number' => 'required|string|max:20',
            'unit_number'  => 'required|string|max:10',
            'block'        => 'required|string|max:5',
        ]);

        // Create the user with tenant role
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'tenant',
        ]);

        // Create the linked tenant profile
        Tenant::create([
            'u_id'         => $user->u_id,
            'phone_number' => $request->phone_number,
            'unit_number'  => $request->unit_number,
            'block'        => $request->block,
            'lease_start'  => now()->toDateString(),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('tenant.dashboard');
    }
}