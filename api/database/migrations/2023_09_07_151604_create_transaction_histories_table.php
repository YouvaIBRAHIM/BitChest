<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transaction_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('wallet_id');
            $table->foreign('wallet_id')->references('id')->on('wallets')->onDelete('cascade');
            $table->unsignedBigInteger('crypto_id');
            $table->foreign('crypto_id')->references('id')->on('cryptos')->onDelete('cascade');            
            $table->unsignedBigInteger('purchase_crypto_rate_id');
            $table->foreign('purchase_crypto_rate_id')->references('id')->on('crypto_rates')->onDelete('cascade');
            $table->unsignedBigInteger('sale_crypto_rate_id')->nullable();
            $table->foreign('sale_crypto_rate_id')->references('id')->on('crypto_rates')->onDelete('cascade');
            $table->float('amount');
            $table->float('service_fees');
            $table->float('gas_fees');
            $table->boolean('isSold')->default(false);
            $table->enum('type', ['buy', 'sell'])->default('buy');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_histories');
    }
};
