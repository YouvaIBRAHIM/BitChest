<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Crypto extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'logo',
        'current_gas',
        'viewed',
        'purchased'
    ];

    // recupère le cours d'une cryptomonnaie
    public function cryptoRates()
    {
        return $this->hasMany(CryptoRate::class)->orderBy('timestamp', 'asc');
    }

    // recupère le cours actuel d'une cryptomonnaie
    public function latestCryptoRate()
    {
        return $this->hasOne(CryptoRate::class)->orderBy('timestamp', 'desc');
    }

    // trie les cryptomonnaies selon un filtre  
    public function scopeFilteredSort($query, $filter, $offset = 0)
    {

        if ($filter === 'trends') {
            $query->orderBy('purchased', 'desc');
        } elseif ($filter === 'popular') {
            $query->orderBy('viewed', 'desc');
        } elseif ($filter === 'latest') {
            $query->orderBy('created_at', 'desc');
        }

        $query->limit(5)->offset($offset);
        
        return $query;
    }


    // récupère les transactions d'une transactions
    public function transactions()
    {
        return $this->hasManyThrough(TransactionHistory::class, CryptoRate::class, 'crypto_id', 'purchase_crypto_rate_id')
            ->orWhereHas('saleCryptoRate', function ($query) {
                $query->where('type', 'sell');
            });
    }
}
