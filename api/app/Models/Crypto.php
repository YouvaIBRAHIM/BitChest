<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Crypto extends Model
{
    use HasFactory;

    
    public function cryptoRates()
    {
        return $this->hasMany(CryptoRate::class)->orderBy('timestamp', 'asc');
    }

    public function latestCryptoRate()
    {
        return $this->hasOne(CryptoRate::class)->orderBy('timestamp', 'asc');
    }
}
