<?php

namespace App\Http\Controllers\User\Card;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class SetTransectionLimitController extends Controller
{
    // this function handles user request to set their transection limit
    public function setTransectionLimit(Request $request, $userId){

        // validate the request
        $request->validate([
            "transection_limit" => "required|numeric|min:0",
        ]);

        $user =  User::findOrFail($userId);

        // Check if the user exists
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'User account not found.'],
         404);}


         $user->transection_limit = $request->transection_limit;
         $user->save();

         return response()->json(['status' => 'success', 'message' => 'Transection limit set successfully.']);



    }
    
}
