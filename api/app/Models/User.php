<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'role',
        'firstname',
        'lastname',
        'email',
        'password',
        'avatar',
        'color',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Récupère les informations d'un portefeuille
    public function wallet() : HasOne
    {
        return $this->hasOne(Wallet::class, 'user_id');
    }

    //Récupère seulement les utilisateurs déjà supprimé en soft delete selon la valeur de $userStatus envoyée depuis le front ent
    public function scopeFilterUsers($query, $userStatus)
    {
        if ($userStatus === 'disabled') {
            return $query->onlyTrashed();
        }

        return;

    }
}
