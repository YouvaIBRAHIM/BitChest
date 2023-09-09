<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        "wallet_id",
        "crypto_id",
        "purchase_crypto_rate_id",
        "sale_crypto_rate_id",
        "service_fees",
        "gas_fees",
        "type",
        "amount",
        "created_at",
    ];



    public function cryptoRate()
    {
        return $this->belongsTo(CryptoRate::class, "purchase_crypto_rate_id", "id");
    }

    public function purchaseCryptoRate()
    {
        return $this->belongsTo(CryptoRate::class, 'purchase_crypto_rate_id');
    }

    public function saleCryptoRate()
    {
        return $this->belongsTo(CryptoRate::class, 'sale_crypto_rate_id');
    }

}
