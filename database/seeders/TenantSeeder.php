<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Tenant;

class TenantSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::create([
            'name'     => 'Jane Tenant',
            'email'    => 'tenant@smartvisitor.com',
            'password' => Hash::make('tenant1234'),
            'role'     => 'tenant',
        ]);

        Tenant::create([
            'u_id'         => $user->u_id,
            'phone_number' => '0712345678',
            'unit_number'  => 'A101',
            'block'        => 'A',
            'lease_start'  => '2024-01-01',
        ]);
    }
}