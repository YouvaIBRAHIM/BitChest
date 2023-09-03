<?php

namespace App\Http\Controllers;

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
    public function showAuthenticatedUserWallet(Request $request)
    {
        try {
            $user = $request->user();
            $wallet = Wallet::where("user_id", $user->id)->with("cryptos")->first()->toArray();

            $wallet = $this->formatCryptoRate($wallet);

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

    private function formatCryptoRate($wallet){
        $balanceRates = [];
        foreach ($wallet["cryptos"] as $key => $crypto) {
            $cryptoRates = json_decode($crypto["crypto_rate"]);
            $wallet["cryptos"][$key]["crypto_rate"] = $cryptoRates;
            $wallet["cryptos"][$key]["current_rate"] = $cryptoRates[count($cryptoRates) - 1][1];
            $wallet["cryptos"][$key]["last_day_rate"] = $cryptoRates[count($cryptoRates) - 24][1];

            foreach ($cryptoRates as $rateKey => $rate) {
                $amount = $rate[1] * $crypto["pivot"]["amount"];

                $lastAmount = $key === 0 ? 0 : $balanceRates[$rateKey][1];
                $total = $lastAmount + $amount;

                $balanceRates[$rateKey] = [$rate[0], $total];
            }
        }
        $wallet["balanceRate"] = $balanceRates;
        return $wallet;
    }

}
