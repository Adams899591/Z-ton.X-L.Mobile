<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\ActivateAccountMail;
use App\Mail\RegisterAccUserMail;
use App\Mail\RegistrationComplectedMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class RegisterController extends Controller
{
    /**
     * Generate a unique 10-digit account number.
     */
    private function generateAccountNumber()
    {
        do {
            $number = mt_rand(1000000000, 9999999999);
        } while (User::where('account_number', $number)->exists());

        return (string) $number;
    }

    // This Page handles user registration
    public function Register(Request $request){
    
        // handle validation
        $request->validate([
            "name" =>  "required|string|max:255",
            "email" => "required|email|unique:users,email",
            "phone" =>  "required|string",
            "nin" => "required|unique:users,nin",
            "bvn" => "required|unique:users,bvn",
            "date_of_birth" => "required",
            "password" => "required|confirmed|min:8",
            "password_confirmation" => "required|same:password",
            // "account_number" => "nullable",
        ]);

        try {
                $accountNumber = $this->generateAccountNumber();
                
                $user = User::create([
                    "name" => $request->name,
                    "email" => $request->email,
                    "password" => Hash::make($request->password), // Always hash passwords
                    "account_type" => "Savings Account",
                    "currency" => "USD",
                    "status" => "InActive",
                    "phone" => $request->phone,
                    "nin" => $request->nin,
                    "bvn" => $request->bvn,
                    "date_of_birth" =>  $request->date_of_birth,
                    "account_number"  => $accountNumber,
                    "balance" => 0,
                    "bank_id" => 1,
                    "network_id" => 1
                ]);

                // Pass the user object to the Mailable class
                Mail::to($user->email)->send(new ActivateAccountMail($user));

                return response()->json([
                    'status' => 'success',
                    'message' => 'Account created successfully',
                    'account_number' => $accountNumber,
                ], 201); 

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
 
   // this function handles user final registration
   public function verifyAccount(Request $request){
        $request->validate([
            "account_number" => "required",
        ]);

        $user = User::where("account_number", $request->account_number)->first();


        if (!$user) {
             return response()->json(['status' => 'error',
                                        "errors" => [
                                        "account_number" => ["Invalid account number."]
                                        ]
                                     ], 404);
        } elseif ($user->status == "Active") {
             return response()->json(['status' => 'error',
                                        "errors" => [
                                        "account_number" => ["User account already activated."]
                                        ]
                                     ], 400);
        } elseif (in_array($user->status, ["Blocked", "Suspended"])) {
             return response()->json(['status' => 'error',
                                        "errors" => [
                                        "account_number" => ["User account under review."]
                                        ]
                                     ], 403);
        }elseif($user->status == "InActive"){

                $user->status = "Active";
                $user->email_verified_at = now();
                $user->save();

                // Pass the user object to the Mailable class
                Mail::to($user->email)->send(new RegistrationComplectedMail($user));

                return response()->json(['status' => 'success', 'message' => 'Account verified successfully.'], 200);

        }
   }

}
