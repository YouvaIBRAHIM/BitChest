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
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

        /**
     * Display the specified resource.
     */
    public function getAuthUserResources(Request $request)
    {
        try {
            $user = $request->user();
            // $wallet = Wallet::where("user_id", $user->id)->with("cryptos")->first()->toArray();
            $wallet = Wallet::with(['cryptosWallet.crypto.latestCryptoRate'])->where('user_id', $user->id)->first()->toArray();

            $wallet = $this->formatUserCurrencies($wallet);
            
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
                "message" => "Oups ! Nous n'avons pas pu supprimer les données.",
                "error" => $th->getMessage()
            ], $th->getCode());
        }
    }

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
                "message" => "Oups ! Nous n'avons créditer votre compter.",
                "error" => $th->getMessage()
            ], $th->getCode());
        }
    }

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
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    protected function formatUserCurrencies($wallet){
        
        $wallet['userCurrencies'][] = [
            "name" => "Euro",
            "code" => "EUR",
            "balance" => $wallet["balance"]
        ];
        
        foreach ($wallet["cryptos_wallet"] as $cryptoWallet) {
            $crypto = $cryptoWallet["crypto"];
            $current_rate = $crypto["latest_crypto_rate"]["rate"];
            $wallet['userCurrencies'][] = [
                "name" => $crypto["name"],
                "code" => $crypto["code"],
                "balance" => $cryptoWallet["amount"] * $current_rate
            ];
        }
        return $wallet;
    }

    private function getCurrentCryptosRate($cryptos){
        foreach ($cryptos as $key => $crypto) {
            $cryptos[$key]["current_rate"] = $crypto["latest_crypto_rate"]["rate"];
        }
        return $cryptos;
    }


    public function buy(Request $request)
    {
        try {

            $user = $request->user();
            $wallet = Wallet::where("user_id", $user->id)->with("cryptos")->first()->toArray();

            $crypto = Crypto::where("code", $request->target)->with('latestCryptoRate')->first();

            $crypto->update([
                "purchased"    => $crypto->purchased + 1,
            ]);

            
            $targetCrypto = $crypto->toArray();
            $amount = $request->amount / $targetCrypto["latest_crypto_rate"]["rate"];

            TransactionHistory::create([
                "wallet_id"         => $wallet['id'],
                "crypto_rate_id"    => $targetCrypto['latest_crypto_rate']['id'],
                "amount"            => round(floatval($amount), 2),
                "type"              => "buy"
            ]);

            //créditer le solde de la crypto
            $cryptoWallet = CryptosWallet::where("wallet_id", $wallet["id"])
            ->where("crypto_id", $targetCrypto["id"])
            ->first();

                        
            if ($cryptoWallet) {
                $newAmount = $cryptoWallet->amount + $amount;

                $cryptoWallet->update([
                    "amount"    => round(floatval($newAmount), 2),
                ]);

            }else{
                CryptosWallet::create([
                    "wallet_id" => $wallet["id"],
                    "crypto_id" => $targetCrypto["id"],
                    "amount"    => floatval($amount)
                ]);
            }


            if ($request->from !== "EUR") {
                $cryptoIndex = array_search($request->from, array_column($wallet["cryptos"], 'code'));
                $fromCryptoWallet = $wallet["cryptos"][$cryptoIndex];
                $fromCrypto = Crypto::where("code", $request->from)->with('latestCryptoRate')->first()->toArray();
                
                $current_rate = $fromCrypto["latest_crypto_rate"]["rate"];

                $fromAmount = $request->total / $current_rate;

                $fromCryptoWallet = CryptosWallet::where("wallet_id", $wallet["id"])
                                ->where("crypto_id", $fromCrypto["id"])
                                ->first();

                $newFromAmount = $fromCryptoWallet->amount - $fromAmount;
                if (round($newFromAmount, 2) <= 0) {
                    $fromCryptoWallet->delete();
                }else{
                    $fromCryptoWallet->update([
                        "amount" => round(floatval($newFromAmount), 2)
                    ]);
                }
            }else {
                Wallet::find($wallet["id"])->update([
                    "balance" => round(floatval($wallet["balance"] - $request->total), 2)
                ]);
            }

            return response()->json(User::with('wallet')->find($request->user()->id), 200);
        } catch (\Throwable $th) {
            return response()->json([
                "message" => "Oups ! Nous n'avons pas pu effectuer la transaction.",
                "error" => $th->getMessage()
            ], $th->getCode());
        }
    }

    public function sell(Request $request)
    {
        try {

            $user = $request->user();
            $wallet = Wallet::where("user_id", $user->id)->with("cryptos")->first()->toArray();            
            
            $cryptoIndex = array_search($request->from, array_column($wallet["cryptos"], 'code'));
            $fromCryptoWallet = $wallet["cryptos"][$cryptoIndex];
            $fromCrypto = Crypto::where("code", $request->from)->with('latestCryptoRate')->first()->toArray();
            
            $current_rate = $fromCrypto["latest_crypto_rate"]["rate"];
            
            $fromAmount = $request->total / $current_rate;
            
            TransactionHistory::create([
                "wallet_id"         => $wallet['id'],
                "crypto_rate_id"    => $fromCrypto['latest_crypto_rate']['id'],
                "amount"            => round(floatval($fromAmount), 2),
                "type"              => "sell"
            ]);

            $fromCryptoWallet = CryptosWallet::where("wallet_id", $wallet['id'])
                                                ->where("crypto_id", $fromCrypto["id"])
                                                ->first();
            
            $newFromAmount = $fromCryptoWallet->amount - $fromAmount;
            if (round($newFromAmount, 2) <= 0) {
                $fromCryptoWallet->delete();
            }else{
                $fromCryptoWallet->update([
                    "amount" => round(floatval($newFromAmount), 2)
                ]);
            }

            Wallet::find($wallet["id"])->update([
                "balance" => round(floatval($wallet["balance"] + $request->amount), 2)
            ]);
            
            return response()->json(User::with('wallet')->find($request->user()->id), 200);
        } catch (\Throwable $th) {
            return response()->json([
                "message" => "Oups ! Nous n'avons pas pu effectuer la transaction.",
                "error" => $th->getMessage()
            ], $th->getCode());
        }
    }

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
                        "error" => 401
                    ], 401);
                }
                $user = User::findOrFail($id); 
            }else {
                $user = $request->user(); 
            }

            $wallet = Wallet::find($user->id);         

            $transactionsHistory = TransactionHistory::with('cryptoRate')
                                                    ->where('wallet_id', $wallet["id"])
                                                    ->select('transaction_histories.*', 'cryptos.code as crypto_code', 'cryptos.name as crypto_name', 'cryptos.logo as crypto_logo')
                                                    ->join('crypto_rates', 'transaction_histories.crypto_rate_id', '=', 'crypto_rates.id')
                                                    ->join('cryptos', 'crypto_rates.crypto_id', '=', 'cryptos.id')
                                                    ->where(function ($query) use ($filter, $offset) {
                                                        if ($filter !== 'all') {
                                                            $query->where('cryptos.code', $filter);
                                                        }                                                
                                                    })
                                                    ->limit(10)->offset($offset)
                                                    ->orderBy('crypto_rates.timestamp', 'desc')
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
