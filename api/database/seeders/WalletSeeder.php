<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Seeder;

class WalletSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::select(['id'])->get()->toArray();

        foreach ($users as $user) {
            Wallet::create([
                "user_id" => $user["id"],
                "balance" => rand(100, 1000000) / 100
            ]);
        }
    }
}
