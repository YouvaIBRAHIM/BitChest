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


Route::group(['middleware' => ['auth:sanctum']], function () {
    //user
    Route::resource('/users', "App\Http\Controllers\UserController")->except(["destroy", "store"]);
    Route::put('/users/password/{user}', ["App\Http\Controllers\UserController", "updatePassword"]);
    
    //wallet
    Route::resource('/wallets', "App\Http\Controllers\WalletController");
    Route::get('/auth-user/wallet', ["App\Http\Controllers\WalletController", "showUserWallet"]);

    //transaction
    Route::get('/auth-user/resources/sale', ["App\Http\Controllers\TransactionController", "getAuthUserSaleResources"]);
    Route::get('/auth-user/resources/purchase', ["App\Http\Controllers\TransactionController", "getAuthUserPurachaseResources"]);
    Route::get('/auth-user/balance', ["App\Http\Controllers\TransactionController", "getAuthUserBalance"]);


    Route::get('/transaction/history', ["App\Http\Controllers\TransactionController", "history"]);
    
    //crypto
    Route::resource('/cryptos', "App\Http\Controllers\CryptoController");
    Route::post('/crypto/newView', ["App\Http\Controllers\CryptoController", "newView"]);
    
    // Récupére l'utilisateur connecté
    Route::get('/auth-user', function (Request $request) {
        return User::with('wallet')->find($request->user()->id);
    });
});

Route::group(['middleware' => ['auth:sanctum', 'client']], function () {

    //transaction
    Route::post('/transaction/buy', ["App\Http\Controllers\TransactionController", "buy"]);
    Route::post('/transaction/sell', ["App\Http\Controllers\TransactionController", "sell"]);
    Route::post('/auth-user/add/balance', ["App\Http\Controllers\TransactionController", "addAuthUserBalance"]);
    Route::post('/auth-user/transfer/balance', ["App\Http\Controllers\TransactionController", "transferAuthUserBalance"]);
});

Route::group(['middleware' => ['auth:sanctum', 'admin']], function () {
    
    Route::get('/config/transaction', ["App\Http\Controllers\ConfigurationController", "getTransactionConfig"]);
    Route::put('/config/transaction', ["App\Http\Controllers\ConfigurationController", "setTransactionConfig"]);
    
    Route::resource('/users', "App\Http\Controllers\UserController")->only(["store"]);
    Route::post('/users/restore', ["App\Http\Controllers\UserController", "restore"]);
    Route::post('/users/delete/multiple', ["App\Http\Controllers\UserController", "destroyMultiple"]);
    Route::resource('/users', "App\Http\Controllers\UserController")->only(["destroy"]);
    
});