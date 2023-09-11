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

    // Récupère l'utilisateur lié au portefeuille
    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // Récupère les cryptomonnaies liées au portefeuille
    public function cryptosWallet() : HasMany
    {
        return $this->hasMany(CryptosWallet::class);
    }

    // Récupère les informations d'une cryptomonnaie avec le montant qu'a l'utilisateur en sa possession
    public function cryptos()
    {
        return $this->belongsToMany(Crypto::class, 'cryptos_wallets', 'wallet_id', 'crypto_id')
            ->withPivot('amount');
    }

    // Rècupère l'historiques des transactions du portefeuille avec le cours lors de l'achat et de la vente
    public function transactions()
    {
        return $this->hasMany(TransactionHistory::class, 'wallet_id')
            ->with(['purchaseCryptoRate', 'saleCryptoRate']);    }
}
