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
        Schema::create('crypto_rates', function (Blueprint $table) {
            $table->id();
            $table->float('rate');
            $table->unsignedBigInteger('timestamp');
            $table->unsignedBigInteger('crypto_id');
            $table->foreign('crypto_id')->references('id')->on('cryptos')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crypto_rates');
    }
};
