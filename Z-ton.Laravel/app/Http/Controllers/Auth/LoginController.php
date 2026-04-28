<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
        public function login(Request $request){

        try {
           
               //  validate the request  
                $credentials = $request->validate([
                        "account_number" => "required",
                        "password" => "required"
                    ]);
                    
                // Attempt to authenticate the user with the provided credentials
                    if (Auth::attempt($credentials)) {
                        return response()->json([
                            'status' => 'success',
                            'user' => Auth::user(),
                        ], 200);
                    }

                    // If authentication fails, return an error response
                    return response()->json(['status' => 'error', 'message' => 'Invalid account number or password.'], 401);
       
        }catch(\Illuminate\Validation\ValidationException $ve) {   // Catch validation exceptions and return a structured error response

            // Return a JSON response with the validation errors and a 422 Unprocessable Entity status code
            return response()->json(['status' => 'error', 
                                      'message' => 'Validation Error: ' ,
                                      'errors' => $ve->errors()
                                      ], 422);

        }catch (\Exception $e) { // Catch any other exceptions and return a generic error response with the exception message
            return response()->json(['status' => 'error', 'message' => 'Server Error: ' . $e->getMessage()], 500);
        }
    }
}
