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

    public function cryptoRates()
    {
        return $this->hasMany(CryptoRate::class)->orderBy('timestamp', 'asc');
    }

    public function latestCryptoRate()
    {
        return $this->hasOne(CryptoRate::class)->orderBy('timestamp', 'desc');
    }

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
}
