<?php

namespace Database\Seeders;

use App\Models\Configuration;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ConfigurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Configuration::create([
            'key' => 'transaction',
            "value" => json_encode([
                "service_fees"=> 2.3,
            ]),
        ]);
    }
}
