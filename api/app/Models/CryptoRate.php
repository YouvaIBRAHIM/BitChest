<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CryptoRate extends Model
{
    use HasFactory;

    // Récupère les informations d'une cryptomonnaie
    public function crypto()
    {
        return $this->belongsTo(Crypto::class);
    }
}
