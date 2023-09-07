<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::group(['middleware' => 'auth:sanctum'], function () {
    //user
    Route::resource('/users', "App\Http\Controllers\UserController");
    Route::put('/users/password/{user}', ["App\Http\Controllers\UserController", "updatePassword"]);
    Route::post('/users/delete/multiple', ["App\Http\Controllers\UserController", "destroyMultiple"]);
    
    //wallet
    Route::resource('/wallets', "App\Http\Controllers\WalletController");
    Route::get('/auth-user/wallet', ["App\Http\Controllers\WalletController", "showUserWallet"]);

    //transaction
    Route::get('/auth-user/resources', ["App\Http\Controllers\TransactionController", "getAuthUserResources"]);
    Route::get('/auth-user/balance', ["App\Http\Controllers\TransactionController", "getAuthUserBalance"]);
    Route::post('/auth-user/add/balance', ["App\Http\Controllers\TransactionController", "addAuthUserBalance"]);
    Route::post('/auth-user/transfer/balance', ["App\Http\Controllers\TransactionController", "transferAuthUserBalance"]);
    Route::post('/transaction/buy', ["App\Http\Controllers\TransactionController", "buy"]);
    Route::post('/transaction/sell', ["App\Http\Controllers\TransactionController", "sell"]);
    Route::get('/transaction/history', ["App\Http\Controllers\TransactionController", "history"]);

    //crypto
    Route::resource('/cryptos', "App\Http\Controllers\CryptoController");
    Route::post('/crypto/newView', ["App\Http\Controllers\CryptoController", "newView"]);
    

    // Récupére l'utilisateur connecté
    Route::get('/auth-user', function (Request $request) {
        return User::with('wallet')->find($request->user()->id);
    });
});
