<?php

namespace Database\Seeders;

use App\Http\Controllers\CryptoController;
use App\Models\Crypto;
use App\Models\CryptoRate;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CryptoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cryptos = [
            [
                "name" => "Bitcoin",
                "code" => "BTC",
                "logo" => "/storage/img/cryptos/bitcoin.png",
            ],
            [
                "name" => "Ethereum",
                "code" => "ETH",
                "logo" => "/storage/img/cryptos/ethereum.png",
            ],
            [
                "name" => "Ripple",
                "code" => "XRP",
                "logo" => "/storage/img/cryptos/ripple.png",
            ],
            [
                "name" => "Bitcoin Cash",
                "code" => "BCC",
                "logo" => "/storage/img/cryptos/bitcoin-cash.png",
            ],
            [
                "name" => "Cardano",
                "code" => "ADA",
                "logo" => "/storage/img/cryptos/cardano.png",
            ],
            [
                "name" => "Litecoin",
                "code" => "LTC",
                "logo" => "/storage/img/cryptos/litecoin.png",
            ],
            [
                "name" => "NEM",
                "code" => "XEM",
                "logo" => "/storage/img/cryptos/nem.png",
            ],
            [
                "name" => "Stellar",
                "code" => "XLM",
                "logo" => "/storage/img/cryptos/stellar.png",
            ],
            [
                "name" => "IOTA",
                "code" => "MIOTA",
                "logo" => "/storage/img/cryptos/iota.png",
            ],
            [
                "name" => "Dash",
                "code" => "Dash",
                "logo" => "/storage/img/cryptos/dash.png",
            ],
        ];


        $currentDate = strtotime(date('Y-m-d'));

        foreach ($cryptos as $crypto) {

            $newCrypto = Crypto::create([
                "name"          => $crypto['name'],
                "code"          => $crypto['code'],
                "logo"          => $crypto['logo'],
                "current_gas"   => rand(10, 100) / 10,
                "viewed"        => rand(0, 1000),
                "purchased"     => rand(0, 1000),
            ]);

            $rate = 0;
            for ($i = 29; $i >= 0; $i--) {
                $timestamp = strtotime("-$i days", $currentDate) * 1000;
            
                $cotation = $i === 29 ? CryptoController::getFirstCotation($crypto['name']) : CryptoController::getCotationFor($crypto['name']);
                $rate += $cotation;

                $crypto_rate = [
                    "crypto_id" => $newCrypto->id,
                    "timestamp" => $timestamp,
                    "rate" => $rate,                    
                ];

                CryptoRate::create($crypto_rate);
            }

        }
    }

    
}
