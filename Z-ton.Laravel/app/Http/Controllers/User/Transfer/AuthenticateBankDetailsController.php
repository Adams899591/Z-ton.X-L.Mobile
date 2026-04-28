<?php

namespace App\Http\Controllers\User\Transfer;

use App\Http\Controllers\Controller;
use App\Models\Bank;
use App\Models\User;
use Illuminate\Http\Request;

class AuthenticateBankDetailsController extends Controller
{
    // Function to authenticate bank details
    public function authenticateBankDetails(Request $request, $userId)
    {
        try {
            // validate the request
            $request->validate([
                'account_number' => 'required|numeric',
                'amount' => 'required|numeric|min:100',
                'description' => 'nullable|string|min:3',
                'bank_id' => 'required|numeric',
            ], [
                "bank_id.required" => "The selected bank is invalid or does not exist.",
            ]);


            // check if bank exists
            $bank = Bank::find($request->bank_id);
            if (!$bank) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation Error',
                    'errors' => [
                        'bank_id' => ['The selected bank is invalid or does not exist.']
                    ]
                ], 422);
            }

            // check if the destination account number exists
            $accountReceiver = User::where('account_number', $request->account_number)->first();
            if (!$accountReceiver) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation Error',
                    'errors' => [
                        'account_number' => ['Destination account number is not valid.']
                    ]
                ], 422);
            }

            // check if the account number provided is valid with the user bank 
            if ($accountReceiver->bank_id != $request->bank_id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation Error',
                    'errors' => [
                        'account_number' => ['Destination account number does not match the selected bank.']
                    ]
                ], 422);
            }

            // check if user try to send money to himself
            $accountSender = User::find($userId);
            if ($accountReceiver->account_number == $accountSender->account_number) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation Error',
                    'errors' => [
                        'account_number' => ['You cannot send money to yourself.']
                    ]
                ], 422);
            }

            // IF ALL REQUEST RUN SUCCESSFULLY

            // authenticate bank details
            return response()->json([
                'status' => "success",
                'message' => 'Bank details authenticated successfully',
                "receiver_name" => $accountReceiver->name,
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $ve) {   // Catch validation exceptions and return a structured error response

            // Return a JSON response with the validation errors and a 422 Unprocessable Entity status code
            return response()->json([
                'status' => 'error',
                'message' => 'Validation Error: ',
                'errors' => $ve->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => "error",
                'message' => 'Bank details not authenticated',
            ], 500);
        }
    }
}
