<?php

namespace App\Http\Controllers\User\Transfer;

use App\Http\Controllers\Controller;
use App\Models\Bank;
use App\Models\User;
use Illuminate\Http\Request;

class TransferController extends Controller
{

    // Function to fetch all banks
    public function fetchBanks()
    {
        $banks =  Bank::all();

        return response()->json([
            'status' => "success",
            'message' => 'Banks fetched successfully',
            'banks' => $banks,
        ], 200);
    }
}
