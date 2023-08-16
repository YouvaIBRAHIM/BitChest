<?php

namespace Database\Seeders;

use App\Models\Crypto;
use App\Models\CryptosWallet;
use App\Models\Wallet;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CryptosWalletSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $wallets = Wallet::select(["id"])->get()->toArray();
        $cryptos = array_column(Crypto::select(["id"])->get()->toArray(), "id");

        foreach ($wallets as $wallet) {
            shuffle($cryptos);
            $randCryptoList = array_slice($cryptos, 0, rand(1, 5));

            foreach ($randCryptoList as $cryptoId) {
                CryptosWallet::create([
                    "wallet_id" => $wallet["id"],
                    "crypto_id" => $cryptoId,
                    "amount"    => rand(100, 100000) / 100
                ]);
            }
        }
    }
}
