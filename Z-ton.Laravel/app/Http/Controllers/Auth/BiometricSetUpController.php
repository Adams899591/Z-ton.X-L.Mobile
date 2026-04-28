<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class BiometricSetUpController extends Controller
{
      // this function handles the seeting up of user fingerPrint 
    public function enableBiometrictSetUp(Request $request, $userId){
        
                    
            $user = User::findOrFail($userId);

            if (!$user) {
                return response()->json(['status' => 'error', 'message' => 'User not found.'], 404);
            }

            $user->biometric_token = $request->biometric_token;
            $user->save();

            return response()->json(['status' => 'success', 'message' => 'Fingerprint authentication enabled!.'], 200);

    }
}
