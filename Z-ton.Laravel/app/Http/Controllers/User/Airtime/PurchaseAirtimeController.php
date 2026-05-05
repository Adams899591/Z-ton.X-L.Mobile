<?php

namespace App\Http\Controllers\User\Airtime;

use App\Http\Controllers\Controller;
use App\Models\Network;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PurchaseAirtimeController extends Controller
{
    // Function to handle airtime purchase
    public function purchaseAirtime(Request $request, $userId){

                    // Validate the request data
                    $request->validate([
                        'network_id' => 'required|exists:networks,id',
                        'amount' => 'required|numeric|min:100',
                        'phone_number' => 'required|string'
                    ]);

        try {


                    $network = Network::find($request->network_id);
                    $user = User::find($userId);

                    // Check if the network and user exist
                    if (!$network) {
                        return response()->json([
                            'status' => 'error',
                            "errors" => [
                                "network_id" => ["The selected mobile network provider is invalid."]
                            ]
                        ], 404);
                    }

                    // Check if the user exists
                    if (!$user) {
                        return response()->json([
                            'status' => 'error',
                            'message' => 'User account not found.'
                        ], 404);
                    }

                    // check if the user has sufficient balance for the purchase
                    if ($user->balance < $request->amount) { 
                        return response()->json([
                            'status' => 'error',
                            "errors" => [
                                "amount" => ["Insufficient balance for this purchase."]
                            ]
                        ], 400);
                    }

                
                    // check if the phone number is valid
                    if (!preg_match('/^\d{10,15}$/', $request->phone_number)) {
                        return response()->json([
                            'status' => 'error',
                            "errors" => [
                                "phone_number" => ["Invalid phone number format."]
                            ]
                        ], 400);
                    }

                    // Normalize phone number to local format for prefix detection
                    $phone = $request->phone_number;
                    if (str_starts_with($phone, '234')) {
                        $phone = '0' . substr($phone, 3);
                    } elseif (!str_starts_with($phone, '0') && strlen($phone) >= 10) {
                        $phone = '0' . $phone;
                    }

                    // Detect the network based on the phone number prefix (usually 4 digits)
                    $prefix = substr($phone, 0, 4);
                    $networkPrefixes = [
                        'MTN' => ['0803', '0806', '0703', '0706', '0810', '0813', '0814', '0816', '0903', '0906', '0913', '0916', '0702', '0704'],
                        'Airtel' => ['0802', '0808', '0701', '0708', '0812', '0901', '0902', '0904', '0907', '0911', '0912'],
                        'Glo' => ['0805', '0807', '0705', '0811', '0905', '0915'],
                        '9mobile' => ['0809', '0817', '0818', '0908', '0909'],
                    ];

                    // Safety check: prevent 500 error if network name is not in the array
                    if (!isset($networkPrefixes[$network->name])) {
                        return response()->json([
                            'status' => 'error',
                            "errors" => [
                                "network_id" => ['Network provider validation not configured for: ' . $network->name]
                            ]
                        ], 400);
                    }

                    if (!in_array($prefix, $networkPrefixes[$network->name])) {
                        return response()->json([
                            'status' => 'error',
                            "errors" => [
                                "phone_number" => ["The phone number does not match the selected network."]
                            ]
                        ], 400);
                    }

                    // Generate a unique request_id (Mandatory for VTpass)
                    // Format: YYYYMMDDHHII + unique string
                    $requestId = now()->format('YmdHi') . Str::random(5);

                    // Deduct the amount and return success
                    $user->decrement('balance', $request->amount);

                    // Generate the VTpass serviceID (e.g., mtn-airtime, airtel-airtime)
                    $serviceID = strtolower($network->name) . '-airtime';

                    // Send request to VTpass
                    $response = Http::withHeaders([
                        "api-key" => env('VTPASS_API_KEY'),
                        // "public-key" => env('VTPASS_PUBLIC_KEY'),
                        "secret-key" => env('VTPASS_SECRET_KEY'),
                    ])->post('https://sandbox.vtpass.com/api/', [
                        "request_id" => $requestId,
                        "serviceID" => $serviceID,
                        "amount" => $request->amount,
                        "phone" => $request->phone_number,
                    ]);

                    $result = $response->json();

                    // Check if transaction was actually successful (code '000' is success in VTpass)
                    if ($response->successful() && isset($result['code']) && $result['code'] === '000') {
                    return response()->json([
                        'status' => 'success',
                        'message' => 'Airtime purchased successfully',
                        'data' => $result
                    ]);
                    }

                    // If API failed, refund the user
                    $user->increment('balance', $request->amount);

                    return response()->json([
                        'status' => 'error',
                        'message' => 'Transaction Failed: ' . ($result['response_description'] ?? 'Invalid Credentials or Provider Error'),
                        'error_code' => $result['code'] ?? 'unknown'
                    ], 400);

        }  catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Server Error: ' . $e->getMessage()
            ], 500);
        }
    }
}
