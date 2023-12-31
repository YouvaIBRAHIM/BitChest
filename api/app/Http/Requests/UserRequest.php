<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $rules = [
            'firstname' => 'required|string|min:1|max:255',
            'lastname' => 'required|string|min:1|max:255',
            'role' => 'string|in:client,admin',
            'email' => 'required|email',
        ];
    
        if ($this->isMethod('post')) {
            $rules['password'] = 'required|min:8'; 
        }
        return $rules;
    }

    public function messages()
    {
        return [
            'required' => 'Le champ :attribute est requis.',
            'email' => 'Le champ :attribute doit être une adresse email valide.',
            'unique' => 'L\'email est déjà utilisé par un autre utilisateur.',
            'min' => 'Le champ :attribute doit avoir au moins :min caractères.',
            'confirmed' => 'La confirmation du mot de passe ne correspond pas.',
            'role.in' => 'Le rôle est soit client soit admin',
        ];
    }
}
