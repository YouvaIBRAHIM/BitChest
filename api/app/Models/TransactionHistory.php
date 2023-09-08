<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        "wallet_id",
        "crypto_rate_id",
        "amount",
        "type"
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
