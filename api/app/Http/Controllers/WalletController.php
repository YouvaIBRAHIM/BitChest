<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WalletController extends Controller
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
    public function showUserWallet(Request $request)
    {
        try {
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

           
            $wallet = Wallet::with(['cryptosWallet.crypto.cryptoRates'])->where('user_id', $user->id)->first()->toArray();

            $wallet = $this->formatUserCryptoRate($wallet);

            return response()->json($wallet, 200);
        } catch (\Throwable $th) {
            return response()->json([
                "message" => "Oups ! Nous n'avons pas pu supprimer les données.",
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

    private function formatUserCryptoRate($wallet){
        $totalCryptosRate = [];
        foreach ($wallet["cryptos_wallet"] as $key => $cryptoWallet) {

            $crypto = $cryptoWallet["crypto"];
            $cryptoRates = $crypto["crypto_rates"];
            
            
            $wallet["cryptos_wallet"][$key]["current_rate"] = $cryptoRates[count($cryptoRates) - 1]["rate"];
            $wallet["cryptos_wallet"][$key]["last_day_rate"] = $cryptoRates[count($cryptoRates) - 2]["rate"];
            
            
            $balanceRates = [];
            foreach ($cryptoRates as $rateKey => $rate) {
                $amount = round($rate["rate"] * $cryptoWallet["amount"], 2);

            
                $lastAmount = $key === 0 ? 0 : $totalCryptosRate[$rateKey][1];
                
                $total = $lastAmount + $amount;
                $totalCryptosRate[$rateKey] = [$rate["timestamp"], $total];

                $balanceRates[$rateKey] = [$rate["timestamp"], $amount];
            }
            
            $wallet["cryptos_wallet"][$key]["crypto"]["crypto_rates"] = $balanceRates;

        }
        $wallet["total_cryptos_rate"] = $totalCryptosRate;

        return $wallet;
    }

}
