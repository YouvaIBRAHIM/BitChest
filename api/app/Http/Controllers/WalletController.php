<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WalletController extends Controller
{

    // récupère le portefeuille d'un utilisateur
    public function showUserWallet(Request $request)
    {
        try {
            $id = $request->input('id');
            if ($id) {
                if (Auth::user()->role !== "admin") {
                    return response()->json([
                        "message" => "Vous ne pouvez pas voir cette page.",
                        "error" => 403
                    ], 403);
                }
                $user = User::withTrashed()->findOrFail($id); 

            }else {
                $user = $request->user(); 
            }

           
            $wallet = Wallet::with(['cryptosWallet.crypto.cryptoRates', "transactions"])->where('user_id', $user->id)->first()->toArray();
            $wallet = $this->formatUserCryptoRate($wallet);
            
            return response()->json($wallet, 200);
        } catch (\Throwable $th) {
            return response()->json([
                "message" => "Oups ! Nous n'avons pas pu supprimer les données.",
                "error" => $th->getMessage()
            ], $th->getCode());
        }
    }


    // Calcule la courbe de progression des gains ou pertes des cryptomonnaies d'un utilisateur
    private function formatUserCryptoRate($wallet)
    {
        $totalCryptosRate = [];
        $transactions = $wallet["transactions"];

        foreach ($wallet["cryptos_wallet"] as &$cryptoWallet) {
            $cryptoId = $cryptoWallet["crypto"]["id"];
            $cryptoRates = $cryptoWallet["crypto"]["crypto_rates"];

            $currentRate = end($cryptoRates)["rate"];
            $lastDayRate = prev($cryptoRates)["rate"];

            $cryptoWallet["current_rate"] = $currentRate;
            $cryptoWallet["last_day_rate"] = $lastDayRate;

            $balanceRates = [];
            $cumulativeBalance = 0;

            $prevRate = 0;

            $cryptoRatesLength = count($cryptoRates) - 1;
            foreach ($cryptoRates as $key => $cryptoRate) {
                $timestamp = $cryptoRate["timestamp"];
                $rate = $cryptoRate["rate"];
                $hasTransaction = false;
                foreach ($transactions as $transaction) {
                    $amount = $transaction['amount'];

                    if ($transaction['crypto_id'] === $cryptoId) {
                        if ($transaction['type'] === 'buy' && $transaction["purchase_crypto_rate"]["timestamp"] === $timestamp) {
                            $cumulativeBalance += $amount * $rate;
                            $hasTransaction = true;
                        } elseif ($transaction['type'] === 'sell' && $transaction["sale_crypto_rate"]["timestamp"] === $timestamp) {
                            $cumulativeBalance -= $amount * $rate;
                            $hasTransaction = true;
                        }
                    }
                }


                if (!$hasTransaction) {
                    if ($cryptoRatesLength === $key) {
                        $currentAmount =  $rate * $cryptoWallet["amount"];
                        $cumulativeBalance = $currentAmount;
                    }else{
                        $rateGap = $rate - $prevRate;
                        $prevCumulativeBalanceGap =  ($rateGap / 100) * $cumulativeBalance;
                        $cumulativeBalance += $prevCumulativeBalanceGap;
                    }
                }

                
                $lastAmount = isset($totalCryptosRate[$timestamp]) ? $totalCryptosRate[$timestamp][1] : 0;
                $total = $lastAmount + $cumulativeBalance;
                
                $totalCryptosRate[$timestamp] = [$timestamp, $total];
                $balanceRates[] = [$timestamp, $cumulativeBalance];

                $prevRate = $rate;
            }

            $cryptoWallet["crypto"]["crypto_rates"] = $balanceRates;
        }

        $wallet["total_cryptos_rate"] = array_values($totalCryptosRate); 

        return $wallet;
    }


}
