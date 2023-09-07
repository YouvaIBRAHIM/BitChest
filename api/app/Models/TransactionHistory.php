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
        return $this->belongsTo(CryptoRate::class);
    }

}
