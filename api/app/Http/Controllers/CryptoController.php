<?php

namespace App\Http\Controllers;

use App\Models\Crypto;
use Illuminate\Http\Request;

class CryptoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $search = $request->input('search') ?: "";
            $filter = $request->input('filter') ?: "trends";
            $offset = $request->input('offset') ?: "0";

            $cryptos = Crypto::with(["cryptoRates", "latestCryptoRate"])
                                ->where("name", "LIKE", "%{$search}%")
                                ->orWhere("code", "LIKE", "%$search%")
                                ->filteredSort($filter, $offset)
                                ->get()
                                ->toArray();


            $cryptos = $this->formatCryptoRate($cryptos);

            return response()->json($cryptos, 200);
        } catch (\Throwable $th) {
            return response()->json([
                "message" => "Oups ! Nous n'avons pas pu récupérer les données.",
                "error" => $th->getMessage()
            ], $th->getCode());
        }
    }

    /**
     * Renvoie la valeur de mise sur le marché de la crypto monnaie
     * @param $cryptoname {string} Le nom de la crypto monnaie
     */
    static public function getFirstCotation($cryptoname){
        return ord(substr($cryptoname,0,1)) + rand(0, 10);
    }
    
    /**
     * Renvoie la variation de cotation de la crypto monnaie sur un jour
     * @param $cryptoname {string} Le nom de la crypto monnaie
     */
    static public function getCotationFor($cryptoname){	
        return ((rand(0, 99)>40) ? 1 : -1) * ((rand(0, 99)>49) ? ord(substr($cryptoname,0,1)) : ord(substr($cryptoname,-1))) * (rand(1,10) * .01);
    }

    
    private function formatCryptoRate($cryptos){

        foreach ($cryptos as $key => $crypto) {
            foreach ($crypto["crypto_rates"] as $rateKey => $rate) {
                $crypto["crypto_rates"][$rateKey] = [$rate["timestamp"], $rate["rate"]];
            }
            $cryptos[$key] = $crypto;
        }

        return $cryptos;
    }

    public function newView(Request $request)
    {
        try {
            $crypto = Crypto::find($request->id);

            $crypto->update([
                "viewed" => $crypto->viewed + 1
            ]);

            return response()->json($crypto, 200);
        } catch (\Throwable $th) {
            return response()->json([
                "message" => "Oups ! Nous n'avons pas pu récupérer les données.",
                "error" => $th->getMessage()
            ], $th->getCode());
        }
    }

}
