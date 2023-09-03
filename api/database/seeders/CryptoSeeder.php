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
            $crypto_rate = [];
            for ($i = 29; $i >= 0; $i--) {
            //     $date = date('Y-m-d', strtotime("-$i days", $currentDate));
            //     for ($hour = 0; $hour < 24; $hour++) {

            //         $formattedHour = str_pad($hour, 2, '0', STR_PAD_LEFT);
            //         $timestamp = strtotime("$date $formattedHour:00:00") * 1000;
                
            //         $crypto_rate[] = [
            //             $timestamp,
            //             abs(CryptoController::getCotationFor($crypto['name']))
            //         ];
            //     }
                $timestamp = strtotime("-$i days", $currentDate) * 1000;
            
                $crypto_rate[] = [
                    $timestamp,
                    abs(CryptoController::getCotationFor($crypto['name']))
                ];
            }
            Crypto::create([
                "name"          => $crypto['name'],
                "code"          => $crypto['code'],
                "logo"          => $crypto['logo'],
                "crypto_rate" => json_encode($crypto_rate),
            ]);
        }
    }

    
}
