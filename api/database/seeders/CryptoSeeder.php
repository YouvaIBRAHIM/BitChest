<?php

namespace Database\Seeders;

use App\Http\Controllers\CryptoController;
use App\Models\Crypto;
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
                "logo" => "/img/cryptos/bitcoin.png",
            ],
            [
                "name" => "Ethereum",
                "code" => "ETH",
                "logo" => "/img/cryptos/ethereum.png",
            ],
            [
                "name" => "Ripple",
                "code" => "XRP",
                "logo" => "/img/cryptos/ripple.png",
            ],
            [
                "name" => "Bitcoin Cash",
                "code" => "BCC",
                "logo" => "/img/cryptos/bitcoin-cash.png",
            ],
            [
                "name" => "Cardano",
                "code" => "ADA",
                "logo" => "/img/cryptos/cardano.png",
            ],
            [
                "name" => "Litecoin",
                "code" => "LTC",
                "logo" => "/img/cryptos/litecoin.png",
            ],
            [
                "name" => "NEM",
                "code" => "XEM",
                "logo" => "/img/cryptos/nem.png",
            ],
            [
                "name" => "Stellar",
                "code" => "XLM",
                "logo" => "/img/cryptos/stellar.png",
            ],
            [
                "name" => "IOTA",
                "code" => "MIOTA",
                "logo" => "/img/cryptos/iota.png",
            ],
            [
                "name" => "Dash",
                "code" => "Dash",
                "logo" => "/img/cryptos/dash.png",
            ],
        ];

        $currentDate = strtotime(date('Y-m-d'));

        foreach ($cryptos as $crypto) {
            $currency_rate = [];
            for ($i = 29; $i >= 0; $i--) {
                $date = date('Y-m-d H:i:s', strtotime("-$i days", $currentDate));
                $currency_rate[] = [
                    "rate" => abs(CryptoController::getCotationFor($crypto['name'])),
                    "date" => $date
                ];
            }
            Crypto::create([
                "name"          => $crypto['name'],
                "code"          => $crypto['code'],
                "logo"          => $crypto['logo'],
                "currency_rate" => json_encode($currency_rate),
            ]);
        }
    }

    
}
