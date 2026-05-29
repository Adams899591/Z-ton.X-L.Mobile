<?php

namespace App\Http\Controllers\User\Airtime;

use App\Http\Controllers\Controller;
use App\Models\Network;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class BiometricAirtimeController extends Controller{

    // Function to handle biometric airtime purchase
    public function biometricAirtime(Request $request){

            // Validate the request data
            $request->validate([
                'user_id' => 'required|exists:users,id',
                'network_id' => 'required',
                'amount' => 'required|numeric|min:100',
                'phone_number' => 'required|string'
            ]);

  
            $user = User::find($request->user_id);
            
            // Try finding network by ID or name for compatibility
            $network = Network::where('id', $request->network_id)
                ->orWhere('name', $request->network_id)
                ->first();

            if (!$network) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'The selected mobile network provider is invalid.'
                ], 404);
            }

            if ($user->balance < $request->amount) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Insufficient balance for this purchase.'
                ], 400);
            }

            // Normalize phone number for prefix detection
            $phone = $request->phone_number;
            if (str_starts_with($phone, '234')) {
                $phone = '0' . substr($phone, 3);
            } elseif (!str_starts_with($phone, '0') && strlen($phone) >= 10) {
                $phone = '0' . $phone;
            }

            $prefix = substr($phone, 0, 4);
            $networkPrefixes = [
                'MTN' => ['0803', '0806', '0703', '0706', '0810', '0813', '0814', '0816', '0903', '0906', '0913', '0916', '0702', '0704'],
                'Airtel' => ['0802', '0808', '0701', '0708', '0812', '0901', '0902', '0904', '0907', '0911', '0912'],
                'Glo' => ['0805', '0807', '0705', '0811', '0905', '0915'],
                '9mobile' => ['0809', '0817', '0818', '0908', '0909'],
            ];

            if (!isset($networkPrefixes[$network->name])) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Network provider validation not configured for: ' . $network->name
                ], 400);
            }

            if (!in_array($prefix, $networkPrefixes[$network->name])) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'The phone number does not match the selected network.'
                ], 400);
            }

                        
            // Generate a unique request_id (Mandatory for VTpass)
            // Format: YYYYMMDDHHII + unique string
            $requestId = now()->format('YmdHi') . Str::random(5);

            // Deduct the amount and return success
            $user->decrement('balance', $request->amount);

            // Generate the VTpass serviceID (e.g., mtn-airtime, airtel-airtime)
            $serviceID = strtolower($network->name) . '-airtime';

            // Map the serviceID to VTpass MobileNetwork code
            if ($serviceID == "mtn-airtime") {
                $MobileNetwork = "01";
            } else if ($serviceID == "airtel-airtime") {
                $MobileNetwork = "04";
            } else if ($serviceID == "glo-airtime") {
                $MobileNetwork = "02";
            } else if ($serviceID == "9mobile-airtime") {
                $MobileNetwork = "03";
            } else {
                return response()->json(["status" => "error", "message" => "Invalid serviceID"]);
            }

            // // Send request to Clubkonnect API to process the airtime purchase
            $response = Http::get('https://www.nellobytesystems.com/APIAirtimeV1.asp?', [ // Changed to POST and assumed 'api/pay' for purchase. Please verify the exact endpoint and method with VTpass API documentation.
                "UserID" => config('services.clubkonnect.userid'),
                "APIKey" => config('services.clubkonnect.apikey'),
                "MobileNetwork" => $MobileNetwork,
                "Amount" => $request->amount,
                "MobileNumber" => $request->phone_number,
                "RequestID" => $requestId,
            ]);

            $clubkonnectAirtime = $response->json();

            // Strictly check the status from ClubKonnect
            // Successful requests usually return 'ORDER_RECEIVED' or 'ORDER_COMPLETED'
            if (isset($clubkonnectAirtime['status']) && 
                ($clubkonnectAirtime['status'] === 'ORDER_RECEIVED' || $clubkonnectAirtime['status'] === 'ORDER_COMPLETE')) {
                
                return response()->json([
                    'status' => 'success',
                    'message' => 'Airtime purchased successfully.',
                    'data' => $clubkonnectAirtime
                ]);

            }else { // UnSuccessful requests usually return INSUFFICIENT_APIBALANCE or any other from clubkonnect

                    // If the status is anything else, it's a failure. Refund the user.
                    $user->increment('balance', $request->amount);

                return response()->json([
                    'status' => 'failure',
                    'message' => 'Transaction Failed: ' . ($clubkonnectAirtime['remarks'] ?? 'Invalid response from provider'),
                    'error_details' => $clubkonnectAirtime
                ], 400);

                
            }


    }
    
}
