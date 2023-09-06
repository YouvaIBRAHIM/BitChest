<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CryptoRate extends Model
{
    use HasFactory;

    
    public function crypto()
    {
        return $this->belongsTo(Crypto::class);
    }
}
