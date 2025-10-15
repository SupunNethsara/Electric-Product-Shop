<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            'id' => Str::uuid(),
            'name' => 'Super Admin',
            'email' => 'superadmin@example.com',
            'role' => 'super_admin',
            'password' => Hash::make('superadmin123'),
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
