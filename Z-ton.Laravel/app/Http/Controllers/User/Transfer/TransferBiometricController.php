<?php

namespace App\Http\Controllers\User\Transfer;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransferBiometricController extends Controller
{
    /**
     * Handle transfer authorized via biometric authentication.
     */
    public function biometricTransfer(Request $request)
    {
        try {
            // 1. Validate the incoming request
            $request->validate([
                'user_id' => 'required|exists:users,id',
                'account_number' => 'required|string',
                'amount' => 'required|numeric|min:1',
                'bank_id' => 'nullable',
                'description' => 'nullable|string|max:255',
            ]);

            $sender = User::findOrFail($request->user_id);
            $amount = $request->amount;

            // 2. Check for sufficient balance
            if ($sender->balance < $amount) {
                return response()->json(['status' => 'error', 'message' => 'Insufficient balance.'], 400);
            }

            // 3 caculate all transection made by the user for that day 
            $dailyTransferAmount = Transaction::where("sender_id", $sender->id)->whereDate("created_at", now())->sum("amount");
            
            // 4 Determine the effective limit (custom limit or default of 100,000)
            // We use 100,000 if transection_limit is null or <= 10 (matching your frontend logic)
            $effectiveLimit = ($sender->transection_limit && $sender->transection_limit > 10) ? $sender->transection_limit : 100000;

            if (($dailyTransferAmount + $request->amount) > $effectiveLimit) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Daily transaction limit exceeded. Your limit is ' . number_format($effectiveLimit) . '. You have already transferred ' . number_format($dailyTransferAmount) . ' today.',
                ], 403); // Forbidden
            }

            return DB::transaction(function () use ($sender, $amount, $request) {
                // 4. Deduct from sender
                $sender->decrement('balance', $amount);
                // update sender expenses
                $sender->increment('expenses', $request->amount);


                // 5. Find receiver (Simulated lookup based on account number)
                $receiver = User::where('account_number', $request->account_number)->first();
                if ($receiver) {
                    $receiver->increment('balance', $amount);
                    // update receiver income
                   $receiver->increment('income', $request->amount);
                }

                // 6. Generate transaction reference
                $reference = 'ZTN-BIO-' . Str::upper(Str::random(8));

                // 7. Return the transaction details (matches your transectionHistory structure)
                return response()->json([
                    'status' => 'success',
                    'message' => 'Transfer successful!',
                    'transaction' => [
                        'reference' => $reference,
                        'sender' => $sender->name,
                        'sender_account' => $sender->account_number,
                        'receiver' => $receiver ? $receiver->name : 'External Account',
                        'receiver_bank' => $request->bank_name ?? 'Z-ton Bank',
                        'amount' => $amount,
                        'description' => $request->description ?? '',
                        'date' => now()->format('Y-m-d H:i:s'),
                    ],
                    "user" => $sender,
                ], 200);
            });

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Transaction failed: ' . $e->getMessage()], 500);
        }
    }
}
