<?php

namespace App\Http\Controllers\User\Transfer;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class ConfirmUserTransferController extends Controller
{
    // Function to confirm User Transfer
    public function confirmUserTransfer(Request $request)
    {
        try {
            // 1. Validate the incoming request data
            $request->validate([
                'userId' => 'required|numeric|exists:users,id', // Ensure userId exists in the users table
                'pin' => 'required|numeric|digits:4', // PIN must be 4 digits
                'account_number' => 'required|numeric',
                'bank_id' => 'required|numeric|exists:banks,id', // Ensure bank_id exists in the banks table
                'amount' => 'required|numeric|min:100', // Minimum amount of 100
                'description' => 'nullable|string|max:255',
            ]);

            // 2. Retrieve the user (sender)
            $user = User::find($request->userId);

            // 3. Verify the transaction PIN using the last 4 digits of the user's account number
            $last4DigitsOfAccountNumber = substr($user->account_number, -4);

            // Compare the provided PIN with the last 4 digits of the sender's account number
            if ($last4DigitsOfAccountNumber !== (string)$request->pin) { // Cast both to string for comparison
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid Transaction PIN.',
                ], 401); // Unauthorized
            }

            // 4. Implement your actual transfer logic here
            $reference = null; // Declare $reference outside the closure
            $receiver = null;  // Declare $receiver outside the closure
            $bank = null;      // Declare $bank outside the closure

            // Use a database transaction to ensure atomicity of the transfer process
            DB::transaction(function () use ($request, $user, &$reference, &$receiver, &$bank) { // Pass variables by reference
                // Find the receiver account based on the account number and bank ID
                $receiver = User::where('account_number', $request->account_number)
                    ->where('bank_id', $request->bank_id)
                    ->first();

                if (!$receiver) {
                    throw new \Exception("Receiver account not found.");
                }

                // Check if sender has sufficient balance before proceeding
                if ($user->balance < $request->amount) {
                    throw new \Exception("Insufficient funds to complete this transfer.");
                }

                // Debit the sender's balance using decrement
                $user->decrement('balance', $request->amount);

                // Credit the receiver's balance using increment
                $receiver->increment('balance', $request->amount);

                $reference = 'TRF-' . strtoupper(uniqid());

                // Create a record in the transactions table for auditing
                DB::table('transactions')->insert([
                    'sender_id'      => $user->id,
                    'receiver_id'    => $receiver->id,
                    "category" => "Transfer",
                    'amount'         => $request->amount,
                    'description'    => $request->description ? $request->description : null,
                    'status'         => 'completed',
                    'reference'      => $reference,
                    'created_at'     => now(),
                    'updated_at'     => now(),
                    "title" => null,
                ]);

                // 5 generate receipt for the transection
                $bank = DB::table('banks')->where('id', $request->bank_id)->first();

                $data = [
                    'reference' => $reference,
                    'sender' => $user->name,
                    'sender_account' => '****' . substr($user->account_number, -4),
                    'receiver' => $receiver->name,
                    'receiver_bank' => $bank ? $bank->name : 'N/A',
                    'amount' => $request->amount,
                    'description' => $request->description,
                    'date' => now()->toDateTimeString(),
                ];

                $pdf = Pdf::loadView('pdf.transaction-receipt', $data)->setPaper([0, 0, 300, 600], 'portrait');
                Storage::disk("public")->put('receipts/' . $reference . '.pdf', $pdf->output());

                // NOTE: the transection name is saved on the receipt folder using the transection reference field on database 
            });

            // 6. Return a success response
            return response()->json([
                'status' => 'success',
                'message' => 'Transfer confirmed and processed successfully!',
                    // send all this as responces so we can use it on the frontend to show the receipt details without having to query the database again
                    'reference' => $reference,
                    'sender' => $user->name,
                    'sender_account' => '****' . substr($user->account_number, -4),
                    'receiver' => $receiver?->name,
                    'receiver_bank' => $bank ? $bank->name : 'N/A',
                    'amount' => $request->amount,
                    'description' => $request->description,
                    'date' => now()->toDateTimeString(),
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json(['status' => 'error', 'message' => 'Validation Error', 'errors' => $ve->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }
}
