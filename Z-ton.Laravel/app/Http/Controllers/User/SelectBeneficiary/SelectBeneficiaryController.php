<?php

namespace App\Http\Controllers\User\SelectBeneficiary;

use App\Http\Controllers\Controller;
use App\Models\Bank;
use App\Models\Beneficiary;
use Illuminate\Http\Request;

class SelectBeneficiaryController extends Controller
{
    // Function to fetchBeneficiaries from database
    public function fetchBeneficiaries($userId){

       // find the beneficiary based on the passed user
       $beneficiaries = Beneficiary::where("sender_id", $userId)->get();

       if ($beneficiaries->isEmpty()) {
         // It's good practice to return an empty array if no beneficiaries are found
         return response()->json(["status" => "success", "message" => "No beneficiaries found", "user" => []]);
       }

       // Map through beneficiaries to attach the bank_id by looking up the bank name
       $data = $beneficiaries->map(function($beneficiary) {
           $bank = Bank::where("name", $beneficiary->receiver_bank)->first();
           $beneficiary->bank_id = $bank ? $bank->id : null;
           // We use 'name' instead of 'receiver_name' to match your frontend mapping if needed
           return $beneficiary;
       });

       return response()->json(["status" => "success", "user" => $data]);
    }

    // Function to deleteBeneficiary 
    public function deleteBeneficiary($beneficiaryId){
        $beneficiary = Beneficiary::find($beneficiaryId);
        
        if ($beneficiary) {
            $beneficiary->delete();
            return response()->json(["status" => "success", "message" => "Beneficiary deleted successfully"]);
        }

        // Return a JSON 404 if the beneficiary doesn't exist in the database
        return response()->json(["status" => "error", "message" => "Beneficiary not found"], 404);
    }
}
