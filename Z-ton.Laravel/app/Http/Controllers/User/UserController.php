<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // fetch Bank Details
    public function fetchBankDetails($userId){
        
        // fetch the user and also their bank
        $user = User::where("id", $userId)->with("bank")->get();
        
        return response([
            "status" => "success",
            "result" => $user
        ]);
        
    }

    // update Account Details
    public function updateAccountDetails(Request $request,$userId){
        try {
           
               //  validate the request  
                $credentials = $request->validate([
                        "name" => "required",
                        "email" => "required|email"
                ]);

                $user = User::findOrFail($userId); // find the user 

                // save the user data
                $user->name = $credentials["name"];
                $user->email = $credentials["email"];
                $user->save();
                    
   
                // If updated sucessfuly, return an success response
                return response()->json(['status' => 'success',
                                         "user" =>  $user,
                                         'message' => 'user datails updated successfuly.'], 200);
    
        }catch(\Illuminate\Validation\ValidationException $ve) {   // Catch validation exceptions and return a structured error response

            // Return a JSON response with the validation errors and a 422 Unprocessable Entity status code
            return response()->json(['status' => 'error', 
                                      'message' => 'Validation Error: ' ,
                                      'errors' => $ve->errors()
                                      ], 422);

        }
        
        // catch (\Exception $e) { // Catch any other exceptions and return a generic error response with the exception message
        //     return response()->json(['status' => 'error', 'message' => 'Server Error: ' . $e->getMessage()], 500);
        // }
    }

    // fetchTransections
    public function fetchTransections($userId){

        $user  = User::with("transactions")->findOrFail($userId);

        return response([
            "status" => "success",
            "result" => $user
        ]);


    }

    // delete transaction
    public function deleteTransaction($transactionId){
        Transaction::findOrFail($transactionId)->delete();
        return response()->json(['status' => 'success', 'message' => 'Transaction deleted successfully.']);
    }

}
