<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Guard;

class GuardSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::create([
            'name'     => 'John Guard',
            'email'    => 'guard@smartvisitor.com',
            'password' => Hash::make('guard1234'),
            'role'     => 'guard',
        ]);

        Guard::create([
            'u_id'         => $user->u_id,
            'phone_number' => '0798765432',
            'badge_number' => 'BADGE001',
            'shift'        => 'Morning (6AM - 2PM)',
            'status'       => 'on-duty',
        ]);
    }
}