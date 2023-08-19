<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserPasswordRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'oldPassword' => 'required|string|min:1|max:255',
            'newPassword' => 'required|string|min:1|max:255',
            'confirmationPassword' => 'required|string|min:1|max:255',
        ];
    }

    public function messages()
    {
        return [
            'required' => 'Le champ :attribute est requis.',
            'oldPassword.string' => 'Le champ :attribute doit être une chaine de caractères valide.',
            'newPassword.string' => 'Le champ :attribute doit être une chaine de caractères valide.',
            'confirmationPassword.string' => 'Le champ :attribute doit être une chaine de caractères valide.',
        ];
    }
}
