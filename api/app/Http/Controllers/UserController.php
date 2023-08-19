<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
    public function store(Request $request)
    {
        //
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
