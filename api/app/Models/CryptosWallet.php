<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CryptosWallet extends Model
{
    use HasFactory;

    protected $fillable = [
        'crypto_id',
        'wallet_id',
        'amount'
    ];
}
