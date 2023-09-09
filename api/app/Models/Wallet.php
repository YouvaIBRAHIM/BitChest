<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Wallet extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'balance',
    ];

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function cryptosWallet() : HasMany
    {
        return $this->hasMany(CryptosWallet::class);
    }

    public function cryptos()
    {
        return $this->belongsToMany(Crypto::class, 'cryptos_wallets', 'wallet_id', 'crypto_id')
            ->withPivot('amount');
    }

    public function transactions()
    {
        return $this->hasMany(TransactionHistory::class, 'wallet_id')
            ->with(['purchaseCryptoRate', 'saleCryptoRate']);    }
}
