<?php

namespace App\Http\Controllers;

use App\Models\Configuration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ConfigurationController extends Controller
{
    // Modifie l'accessibilité et le message de maintenance de l'api
    public function setTransactionConfig(Request $request) {
        try {
            $validator = Validator::make(
                $request->all(),
                [
                    'amount' => 'required|numeric|between:0,20',
                ],
                [
                    'amount.required' => 'Le champ "Poucentage" est obligatoire.',
                    'amount.numeric' => 'Le champ "Poucentage" doit être numérique.',
                ]
            );

            if ($validator->fails()) {
                $errors = array_values($validator->errors()->toArray())[0];
                return response()->json([
                    "message" => $errors
                ], 405);
            }

            $amount = $request->amount;

            $newValue = json_encode([
                "service_fees" => $amount
            ]);

            Configuration::where("key", "transaction")->update([
                "value" => $newValue
            ]);
        
            return response()->json(json_decode($newValue), 200);
        } catch (\Throwable $th) {
            return response($th->getMessage(), $th->getCode());
        }
    }

    // Récupére la configuration de la transaction
    public function getTransactionConfig(Request $request) {
        try {

            $transactionConfig = Configuration::where("key", "transaction")
                            ->first();

            return response()->json(json_decode($transactionConfig->value), 200);
        } catch (\Throwable $th) {
            return response($th->getMessage(), $th->getCode());
        }
    }
}
