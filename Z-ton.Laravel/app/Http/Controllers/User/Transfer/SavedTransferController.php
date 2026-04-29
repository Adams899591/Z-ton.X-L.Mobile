<?php

namespace App\Http\Controllers\User\Transfer;

use App\Http\Controllers\Controller;
use App\Models\SavedTransfer;
use Illuminate\Http\Request;

class SavedTransferController extends Controller
{
        public function SavePayment(Request $request)
    {
        try {
            // 1. Validate the incoming request data
            $request->validate([
                'user_id' => 'required|numeric|exists:users,id',
                'reference' => 'required|string|unique:saved_transfers,reference',
                'sender_name' => 'required|string|max:255',
                'sender_account' => 'required|string|max:255',
                'receiver_name' => 'required|string|max:255',
                'receiver_bank' => 'required|string|max:255',
                'receiver_account' => 'required|string|max:255',
                'amount' => 'required|numeric|min:0.01',
                'description' => 'nullable|string|max:255',
                'transaction_date' => 'required|date',
            ]);

            // 2. Create the saved transfer record
            $savedTransfer = SavedTransfer::create([
                'user_id' => $request->user_id,
                'reference' => $request->reference,
                'sender_name' => $request->sender_name,
                'sender_account' => $request->sender_account,
                'receiver_name' => $request->receiver_name,
                'receiver_bank' => $request->receiver_bank,
                'receiver_account' => $request->receiver_account,
                'amount' => $request->amount,
                'description' => $request->description,
                'transaction_date' => $request->transaction_date,
            ]);

            return response()->json(['status' => 'success', 'message' => 'Transfer saved successfully!', 'data' => $savedTransfer], 201);
        } catch (\Illuminate\Validation\ValidationException $ve) {
            return response()->json(['status' => 'error', 'message' => 'Validation Error', 'errors' => $ve->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'An unexpected error occurred: ' . $e->getMessage()], 500);
        }
    }
}
