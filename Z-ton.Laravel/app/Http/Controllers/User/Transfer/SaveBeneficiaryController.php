<?php

namespace App\Http\Controllers\User\Transfer;

use App\Http\Controllers\Controller;
use App\Models\Beneficiary;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class SaveBeneficiaryController extends Controller
{

    // this function help to say beneficiary to database 
     public function saveBeneficiary(Request $request){

        $request->validate([
            "sender_id" => "required",
            "receiver_name" => "required",
            "receiver_bank" => "required",
            "receiver_account" => "required"
        ]);
        
        $result = Beneficiary::where("sender_id", $request->sender_id)->where("receiver_account", $request->receiver_account)->first();

        if (!$result) { // insert record if the user haven't not save the record before 
            DB::table('beneficiaries')->insert([
                "sender_id" => $request->sender_id,
                "receiver_name" => $request->receiver_name,
                "receiver_bank" => $request->receiver_bank,
                "receiver_account" => $request->receiver_account,
                "created_at" => now(),
                "updated_at" => now(),
            ]);

            return response()->json(['status' => 'success', 'message' => 'Beneficiary saved successfully.']);
        }else {
            return response()->json(['status' => 'error', 'message' => 'Beneficiary already exists.']);
        }


       
     }
}
