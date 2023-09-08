<?php

namespace Database\Seeders;

use App\Http\Controllers\CryptoController;
use App\Models\Configuration;
use App\Models\Crypto;
use App\Models\CryptoRate;
use App\Models\CryptosWallet;
use App\Models\TransactionHistory;
use App\Models\Wallet;
use Illuminate\Database\Seeder;

class CryptoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $transactionConfig = Configuration::where("key", "transaction")
        ->first();

        $serviceFees = json_decode($transactionConfig->value)->service_fees;

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

                $newCryptoRate = CryptoRate::create($crypto_rate);

                $numberOfWallets = 1;

                $randomWallets = Wallet::select(["id"])->inRandomOrder()->take($numberOfWallets)->get();
                foreach ($randomWallets as $wallet) {
                    $amount = rand(100, 10000) / 100;
                    $transactionType = rand(0, 1) ? 'buy' : 'sell';

                    $cryptoWallet = CryptosWallet::where("wallet_id", $wallet->id)
                                                ->where("crypto_id", $newCrypto->id)
                                                ->first();
                                                
                    if ($cryptoWallet) {
                        $newAmount = 0;
                        $transactionHistory = TransactionHistory::where("wallet_id", $wallet->id)
                                            ->where("crypto_id", $newCrypto->id)
                                            ->where("type", "buy")
                                            ->where('isSold', false)
                                            ->orderBy("created_at", "desc")
                                            ->first();

                        if ($transactionHistory) {
                            $amountToSell = $transactionHistory->amount;


                            TransactionHistory::create([
                                "wallet_id"                     => $wallet->id,
                                "purchase_crypto_rate_id"       => $transactionHistory->purchase_crypto_rate_id,
                                "sale_crypto_rate_id"           => $newCryptoRate->id,
                                "crypto_id"                     => $newCrypto->id,
                                "amount"                        => $amountToSell,
                                "type"                          => "sell",
                                "service_fees"                  => $serviceFees,
                                "gas_fees"                      => $newCrypto->current_gas
                            ]);

                            $transactionHistory->update([
                                "isSold" => true
                            ]);

                            $cryptoWallet->delete();
                        }

                    }else {
                        $transactionType = "buy";
                        CryptosWallet::create([
                            "wallet_id" => $wallet->id,
                            "crypto_id" => $newCrypto->id,
                            "amount"    => $amount
                        ]);
                        TransactionHistory::create([
                            "wallet_id"                     => $wallet->id,
                            "purchase_crypto_rate_id"       => $newCryptoRate->id,
                            "crypto_id"                     => $newCrypto->id,
                            "amount"                        => $amount,
                            "type"                          => $transactionType,
                            "service_fees"                  => $serviceFees,
                            "gas_fees"                      => $newCrypto->current_gas
                        ]);
                    }

                }

            }

        }
    }

    
}
