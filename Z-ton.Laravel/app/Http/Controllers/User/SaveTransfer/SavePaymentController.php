<?php

namespace App\Http\Controllers\User\SaveTransfer;

use App\Http\Controllers\Controller;
use App\Models\SavedTransfer;
use App\Models\User;
use Illuminate\Http\Request;

class SavePaymentController extends Controller
{

    // function to save user payment 
    public function SaveUserPayment($userId){

        $user = User::with("saveTransfer")->find($userId);

        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'User not found.'], 404);
        }

        return response()->json(['status' => 'success', 'message' => 'User found.', 'data' => $user->saveTransfer]);
    }

    // function to delete saved payment 
    public function deletePayment($paymentId){
        $payment = SavedTransfer::find($paymentId);
        $payment->delete();

        return response()->json(['status' => 'success', 'message' => 'Payment deleted successfully.']);
    }


}
