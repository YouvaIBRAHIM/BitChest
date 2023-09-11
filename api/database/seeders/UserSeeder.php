<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use \App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'firstname' => 'Jérôme',
            'lastname' => 'ADMIN',
            "email" => "jerome@admin.com",
            'password' => Hash::make('password'),
            'role' => 'admin'
        ]);

        User::factory()->create([
            'firstname' => 'admin',
            'lastname' => 'admin',
            "email" => "admin@admin.com",
            'password' => Hash::make('password'),
            'role' => 'client'
        ]);

        User::factory()->create([
            'firstname' => 'Youva',
            'lastname' => 'Ibrahim',
            "email" => "youva.ibrahim@gmail.com",
            'password' => Hash::make('password'),
            'role' => 'client'
        ]);

        User::factory(20)->create();
    }
}
