<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserPasswordRequest;
use App\Http\Requests\UserRequest;
use App\Models\User;
use App\Models\Wallet;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public $restful = true; 
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $searchFilter = $request->input('searchFilter') ?: "email";
            $searchText = $request->input('searchText');

            $users = User::where("role", $request->input('role') ?: "client")
            ->where((function ($query) use ($searchFilter, $searchText) {
                if ($searchFilter !== "name") {
                    $query->where($searchFilter, 'LIKE', "%{$searchText}%");
                }else {
                    $query->where(DB::raw("concat(firstname, ' ', lastname)"), 'LIKE', "%".$searchText."%");
                }
            }))
            ->join('wallets', 'users.id', '=', 'wallets.user_id')
            ->select('users.*', 'wallets.balance')
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('perPage') ?: 10);

            return response()->json($users, 200);
        } catch (\Throwable $th) {
            return response()->json([
                "message" => "Oups ! Nous n'avons pas pu récupérer les données.",
                "error" => $th->getMessage()
            ], $th->getCode());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        try {
            if (Auth::user()->role !== "admin") {
                return response()->json([
                    "message" => "Vous ne pouvez pas créer un nouvel utilisateur.",
                    "error" => 401
                ], 401);
            }
            $validatedData = $request->validated();

            //Vérifie si l'email existe déjà
            $user = User::firstOrCreate([
                "email" => $validatedData["email"]
            ], $validatedData);

            if (!$user->wasRecentlyCreated) {
                return response()->json([
                    "message" => "Cet utilisateur existe déjà.",
                    "error" => 401
                ], 401);

            }
            $wallet = new Wallet([
                "balance" => 0
            ]);

            $user->wallet()->save($wallet);

            $user->balance = 0;
            
            return response()->json($user, 200);
        } catch (\Throwable $th) {
            return response()->json([
                "message" => "Oups ! Nous n'avons pas pu mettre à jour les données.",
                "error" => $th->getMessage()
            ], $th->getCode());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $user = User::find($id);
            return response()->json($user, 200);
        } catch (\Throwable $th) {
            return response()->json([
                "message" => "Oups ! Nous n'avons pas pu récupérer les données.",
                "error" => $th->getMessage()
            ], $th->getCode());
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, User $user)
    {
        try {
            $validatedData = $request->validated();

            $user->update($validatedData);

            $user = $user->fresh();

            return response()->json($user, 200);
        } catch (\Throwable $th) {
            return response()->json([
                "message" => "Oups ! Nous n'avons pas pu mettre à jour les données.",
                "error" => $th->getMessage()
            ], $th->getCode());
        }
    }

    public function updatePassword(UserPasswordRequest $request, User $user)
    {
        try {
            $validatedData = $request->validated();

            if (Hash::check($validatedData['oldPassword'], $user->password)) {
                if ($validatedData['newPassword'] === $validatedData['confirmationPassword']) {
                    $user->update([
                        'password' => Hash::make($validatedData['newPassword']),
                        'remember_token' => Str::random(60),
                    ]);
                }else {
                    throw new Exception("Le nouveau mot de passe et la confirmation ne sont pas identiques.", 401);
                }
            }else {
                throw new Exception("L'ancien mot de passe est incorrect.", 401);
            }
            
            return response()->json($user, 200);
        } catch (\Throwable $th) {
            return response()->json([
                "message" => $th->getMessage(),
                "data" => $user
            ], $th->getCode());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        try {
            $user->delete();
            return response()->json([$user->id], 200);
        } catch (\Throwable $th) {
            return response()->json([
                "message" => "Oups ! Nous n'avons pas pu supprimer les données.",
                "error" => $th->getMessage()
            ], $th->getCode());
        }
    }

        /**
     * Remove the specified resource from storage.
     */
    public function destroyMultiple(Request $request)
    {
        try {
            $userArray = $request->input('users');
            User::whereIn('id', $userArray)->delete();
            return response()->json($userArray, 200);
            
        } catch (\Throwable $th) {
            return response()->json([
                "message" => "Oups ! Nous n'avons pas pu supprimer les données.",
                "error" => $th->getMessage()
            ], $th->getCode());
        }
    }
}
