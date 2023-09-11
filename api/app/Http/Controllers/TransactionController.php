<?php

namespace App\Http\Controllers;

use App\Models\Configuration;
use App\Models\Crypto;
use App\Models\CryptosWallet;
use App\Models\TransactionHistory;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TransactionController extends Controller
{

    // Récupère les ressources de l'utilisateur connecté pour effectuer un achat
    public function getAuthUserPurachaseResources(Request $request)
    {
        try {
            $user = $request->user();
            $wallet = Wallet::with(['cryptosWallet.crypto.latestCryptoRate'])->where('user_id', $user->id)->first()->toArray();
            
            $cryptos = Crypto::with('latestCryptoRate')->get()->toArray();
            $cryptos = $this->getCurrentCryptosRate($cryptos);

            $transactionConfig = Configuration::where("key", "transaction")
                            ->first();
            
            $serviceFees = json_decode($transactionConfig->value)->service_fees;

            return response()->json([
                "wallet" => $wallet,
                "cryptos" => $cryptos,
                "serviceFees" => $serviceFees
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                "message" => "Oups ! Nous n'avons pas pu récupérer les données.",
                "error" => $th->getMessage()
            ], $th->getCode());
        }
    }

    // Récupère les cryptos monnaies d'un utilisateur disponnibles à la vente
    public function getAuthUserSaleResources(Request $request)
    {
        try {
            $user = $request->user();
            $wallet = Wallet::with(['cryptosWallet.crypto.latestCryptoRate'])->where('user_id', $user->id)->first()->toArray();
            
            $transactionHistory = TransactionHistory::with(['purchaseCryptoRate'])
                                                    ->where("wallet_id", $wallet['id'])
                                                    ->where("type", "buy")
                                                    ->where('isSold', false)
                                                    ->join('cryptos', 'transaction_histories.crypto_id', '=', 'cryptos.id')
                                                    ->select(
                                                        'transaction_histories.*',
                                                        'cryptos.code as crypto_code',
                                                        'cryptos.name as crypto_name',
                                                        'cryptos.logo as crypto_logo'
                                                    )
                                                    ->orderBy("created_at", "desc")
                                                    ->get()
                                                    ->toArray();

            $transactionConfig = Configuration::where("key", "transaction")->first();
            
            $serviceFees = json_decode($transactionConfig->value)->service_fees;

            return response()->json([
                "wallet" => $wallet,
                "transactionHistory" => $transactionHistory,
                "serviceFees" => $serviceFees
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                "message" => "Oups ! Nous n'avons pas pu récupérer les données.",
                "error" => $th->getMessage()
            ], $th->getCode());
        }
    }

    // Récupère le portefeuille d'un utilisateur
    public function getAuthUserBalance(Request $request)
    {
        try {
            $user = $request->user();
            $wallet = Wallet::where("user_id", $user->id)->first()->toArray();

            $transactionConfig = Configuration::where("key", "transaction")
                            ->first();
            
            $serviceFees = json_decode($transactionConfig->value)->service_fees;

            return response()->json([
                "wallet" => $wallet,
                "serviceFees" => $serviceFees
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                "message" => "Oups ! Nous n'avons pas pu récupérer les données.",
                "error" => $th->getMessage()
            ], $th->getCode());
        }
    }

    // Ajoute de l'argent dans le portefeuille de l'utilisateur
    public function addAuthUserBalance(Request $request)
    {
        try {
            $validator = Validator::make(
                $request->all(),
                [
                    'amount' => 'required|numeric',
                ],
                [
                    'amount.required' => 'Le champ "Montant" est obligatoire.',
                    'amount.numeric' => 'Le champ "Montant" doit avoir une valeur numerique.',
                ]
            );
            
            if ($validator->fails()) {
                $errors = array_values($validator->errors()->toArray())[0];
                return response()->json($errors, 405);
            }

            $user = $request->user();
            $wallet = Wallet::where("user_id", $user->id)->first();
            $wallet->update([
                "balance" => floatval($wallet->balance) + floatval($request->amount)
            ]);

            return response()->json($wallet, 200);
        } catch (\Throwable $th) {
            return response()->json([
                "message" => "Oups ! Nous n'avons pas pu supprimer les données.",
                "error" => $th->getMessage()
            ], $th->getCode());
        }
    }

    // Retire de l'argent du portefeuille de l'utilisateur
    public function transferAuthUserBalance(Request $request)
    {
        try {
            $validator = Validator::make(
                $request->all(),
                [
                    'amount' => 'required|numeric',
                ],
                [
                    'amount.required' => 'Le champ "Montant" est obligatoire.',
                    'amount.numeric' => 'Le champ "Montant" doit avoir une valeur numerique.',
                ]
            );
            
            if ($validator->fails()) {
                $errors = array_values($validator->errors()->toArray())[0];
                return response()->json($errors, 405);
            }

            $user = $request->user();
            $wallet = Wallet::where("user_id", $user->id)->first();
            $newBalance = floatval($wallet->balance) - floatval($request->amount);
            $wallet->update([
                "balance" => $newBalance > 0 ? $newBalance : 0
            ]);

            return response()->json($wallet, 200);
        } catch (\Throwable $th) {
            return response()->json([
                "message" => "Oups ! Nous n'avons pas pu transférer votre solde.",
                "error" => $th->getMessage()
            ], $th->getCode());
        }
    }

    // Récupére le cours actuel des cryptomonnaies
    private function getCurrentCryptosRate($cryptos){
        foreach ($cryptos as $key => $crypto) {
            $cryptos[$key]["current_rate"] = $crypto["latest_crypto_rate"]["rate"];
        }
        return $cryptos;
    }


    // Permet de faire un achat et d'ajouter une transaction dans l'historique de l'utilisateur
    public function buy(Request $request)
    {
        try {

            $transactionConfig = Configuration::where("key", "transaction")
            ->first();

            $serviceFees = json_decode($transactionConfig->value)->service_fees;

            $user = $request->user();
            $wallet = Wallet::where("user_id", $user->id)->with("cryptos")->first()->toArray();

            $crypto = Crypto::where("id", $request->target)->with('latestCryptoRate')->first();

            $targetCrypto = $crypto->toArray();

            $transactionTotalAmount = $request->totalAmount * $targetCrypto["latest_crypto_rate"]["rate"];
            $transactionServiceFees = round(($serviceFees / 100) * $transactionTotalAmount, 2);
            $transactionTotalAmountWithFees = round($transactionTotalAmount + $transactionServiceFees + $targetCrypto["current_gas"], 2);


            //créditer le solde de la crypto
            $cryptoWallet = CryptosWallet::where("wallet_id", $wallet["id"])
                                            ->where("crypto_id", $targetCrypto["id"])
                                            ->first();

            if ($wallet["balance"] >= $transactionTotalAmountWithFees) {
                if ($cryptoWallet) {
                    $newAmount = $cryptoWallet->amount + $request->totalAmount;
    
                    $cryptoWallet->update([
                        "amount"    => floatval($newAmount),
                    ]);
    
                }else{
                    CryptosWallet::create([
                        "wallet_id" => $wallet["id"],
                        "crypto_id" => $targetCrypto["id"],
                        "amount"    => floatval($request->totalAmount)
                    ]);
                }
    
    
                Wallet::find($wallet["id"])->update([
                    "balance" => round(floatval($wallet["balance"] - $transactionTotalAmountWithFees), 2)
                ]);
    
                TransactionHistory::create([
                    "wallet_id"                     => intval($wallet['id']),
                    "crypto_id"                     => intval($request->target),
                    "purchase_crypto_rate_id"       => intval($targetCrypto["latest_crypto_rate"]["id"]),
                    "amount"                        => $request->totalAmount,
                    "service_fees"                  => $serviceFees,
                    "gas_fees"                      => $targetCrypto['current_gas'],
                    "type"                          => "buy"
                ]);
    
                $crypto->update([
                    "purchased"    => $crypto->purchased + 1,
                ]);
    
                return response()->json(User::with('wallet')->find($request->user()->id), 200);
            }    
            return response()->json([
                "message" => "Oups ! Nous n'avons pas pu effectuer la transaction. Solde insuffisant.",
                "error" => 403
            ], 403);
        } catch (\Throwable $th) {
            return response()->json([
                "message" => "Oups ! Nous n'avons pas pu effectuer la transaction.",
                "error" => $th->getMessage()
            ], $th->getCode());
        }
    }

    // Permet de faire une vente et d'ajouter une transaction dans l'historique de l'utilisateur
    public function sell(Request $request)
    {
        try {
            $transactionConfig = Configuration::where("key", "transaction")
                            ->first();
            
            $serviceFees = json_decode($transactionConfig->value)->service_fees;

            $user = $request->user();
            $wallet = Wallet::where("user_id", $user->id)->with("cryptos")->first()->toArray();            
            
            $cryptoIndex = array_search($request->from, array_column($wallet["cryptos"], 'id'));
            
            $fromCryptoWallet = $wallet["cryptos"][$cryptoIndex];
            $fromCrypto = Crypto::where("id", $request->from)->with('latestCryptoRate')->first()->toArray();
                        
            $current_rate = $fromCrypto["latest_crypto_rate"]["rate"];
            
            
            $transactionTotalAmount = round($request->transaction["amount"] * $current_rate, 2);
            $transactionServiceFees = round(($serviceFees / 100) * $transactionTotalAmount, 2);
            $transactionTotalAmountWithFees = round($transactionTotalAmount - $transactionServiceFees - $fromCrypto['current_gas'], 2);
            
            $fromCryptoWallet = CryptosWallet::where("wallet_id", $wallet['id'])
                                                ->where("crypto_id", $fromCrypto["id"])
                                                ->first();
            
            $newFromAmount = $fromCryptoWallet->amount - $transactionTotalAmountWithFees;
            if (round($newFromAmount, 2) <= 0) {
                $fromCryptoWallet->delete();
            }else{
                $fromCryptoWallet->update([
                    "amount" => round(floatval($newFromAmount), 2)
                ]);
            }

            Wallet::find($wallet["id"])->update([
                "balance" => round(floatval($wallet["balance"] + $transactionTotalAmountWithFees), 2)
            ]);


            TransactionHistory::create([
                "wallet_id"                     => intval($wallet['id']),
                "crypto_id"                     => intval($request->from),
                "purchase_crypto_rate_id"       => intval($request->transaction["purchase_crypto_rate_id"]),
                "sale_crypto_rate_id"           => intval($fromCrypto['latest_crypto_rate']['id']),
                "amount"                        => $request->transaction["amount"],
                "service_fees"                  => $serviceFees,
                "gas_fees"                      => $fromCrypto['current_gas'],
                "type"                          => "sell"
            ]);
            
            return response()->json(User::with('wallet')->find($request->user()->id), 200);
        } catch (\Throwable $th) {
            return response()->json([
                "message" => "Oups ! Nous n'avons pas pu effectuer la transaction.",
                "error" => $th->getMessage()
            ], $th->getCode());
        }
    }

    // Récupère l'historique de transactions d'un utilisateur
    public function history(Request $request)
    {
        try {
            $filter = $request->input('filter') ?: "all";
            $offset = $request->input('offset') ?: 0;
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

            $wallet = Wallet::where("user_id", $user->id)->first();     

            $transactionsHistory = TransactionHistory::with(['cryptoRate', 'purchaseCryptoRate', 'saleCryptoRate'])
                                                        ->where('wallet_id', $wallet["id"])
                                                        ->join('cryptos', 'transaction_histories.crypto_id', '=', 'cryptos.id')
                                                        ->select(
                                                            'transaction_histories.*',
                                                            'cryptos.code as crypto_code',
                                                            'cryptos.name as crypto_name',
                                                            'cryptos.logo as crypto_logo'
                                                        )
                                                        ->where(function ($query) use ($filter) {
                                                            if ($filter !== 'all') {
                                                                $query->where('cryptos.code', $filter);
                                                            }
                                                        })
                                                        ->limit(10)
                                                        ->offset($offset)
                                                        ->orderBy('transaction_histories.id', 'desc')
                                                        ->get();
        
            
            $cryptos = TransactionHistory::with('cryptoRate.crypto')
                                            ->where('wallet_id', $wallet["id"])
                                            ->get()
                                            ->pluck('cryptoRate.crypto')
                                            ->unique()
                                            ->toArray();

            return response()->json([
                "transactionsHistory" => $transactionsHistory,
                "cryptos"               => array_values($cryptos)
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                "message" => "Oups ! Nous n'avons pas pu effectuer la transaction.",
                "error" => $th->getMessage()
            ], $th->getCode());
        }
    }
    
}
