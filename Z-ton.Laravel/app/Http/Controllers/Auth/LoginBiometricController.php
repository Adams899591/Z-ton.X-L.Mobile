<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginBiometricController extends Controller
{

    // this function handles  user biometric ligin 
    public function loginBiometric(Request $request){

        // use first() to get a single user object instead of a collection array
        $user = User::where("biometric_token", $request->biometric_token)->first();

        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'User not found.'], 404);
        }

         return response()->json(['status' => 'success', 'user' => $user], 200);
    }
}
