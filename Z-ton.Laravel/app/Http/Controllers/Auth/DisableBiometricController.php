<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class DisableBiometricController extends Controller
{
      // this function handles disable of the user fingerPrint 
    public function disableBiometrictSetUp($userId){
        
                    
            $user = User::findOrFail($userId);

            if (!$user) {
                return response()->json(['status' => 'error', 'message' => 'User not found.'], 404);
            }

            $user->biometric_token = null;
            $user->save();

            return response()->json(['status' => 'success', 'message' => 'Fingerprint authentication disabled!.'], 200);

    }
}
