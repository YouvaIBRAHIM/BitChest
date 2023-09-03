<?php

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
    Route::resource('/users', "App\Http\Controllers\UserController");
    Route::put('/users/password/{user}', ["App\Http\Controllers\UserController", "updatePassword"]);
    Route::post('/users/delete/multiple', ["App\Http\Controllers\UserController", "destroyMultiple"]);
    
    Route::resource('/wallets', "App\Http\Controllers\WalletController");
    Route::get('/auth-user/wallet', ["App\Http\Controllers\WalletController", "showAuthenticatedUserWallet"]);

    Route::get('/auth-user/resources', ["App\Http\Controllers\TransactionController", "getAuthUserResources"]);

    

    // Récupére l'utilisateur connecté
    Route::get('/auth-user', function (Request $request) {
        return $request->user();
    });
});
