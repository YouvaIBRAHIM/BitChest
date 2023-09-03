<?php

namespace App\Http\Controllers;

use App\Models\Configuration;
use App\Models\Crypto;
use App\Models\Wallet;
use Illuminate\Http\Request;

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
            $wallet = Wallet::where("user_id", $user->id)->with("cryptos")->first()->toArray();
            $wallet = $this->formatUserCurrencies($wallet);
            
            $cryptos = Crypto::all()->toArray();
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

    private function formatUserCurrencies($wallet){
        $wallet['userCurrencies'][] = [
            "name" => "Euro",
            "code" => "EUR",
            "balance" => $wallet["balance"]
        ];

        foreach ($wallet["cryptos"] as $key => $crypto) {
            $cryptoRates = json_decode($crypto["crypto_rate"]);
            $current_rate = $cryptoRates[count($cryptoRates) - 1][1];

            $wallet['userCurrencies'][] = [
                "name" => $crypto["name"],
                "code" => $crypto["code"],
                "balance" => $crypto["pivot"]["amount"] * $current_rate
            ];
        }
        return $wallet;
    }

    private function getCurrentCryptosRate($cryptos){
        foreach ($cryptos as $key => $crypto) {
            $cryptoRates = json_decode($crypto["crypto_rate"]);
            $cryptos[$key]["current_rate"] = $cryptoRates[count($cryptoRates) - 1][1];
            $cryptos[$key]["current_gas"] = abs(CryptoController::getCotationFor($crypto['name'])) * 10;
        }
        return $cryptos;
    }

}
