<?php

namespace App\Http\Controllers\User\Airtime;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Network;
use App\Models\User;

class BiometricAirtimeController extends Controller
{
    // Function to handle biometric airtime purchase
    public function biometricAirtime(Request $request)
    {
        // Validate the request data
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'network_id' => 'required',
            'amount' => 'required|numeric|min:100',
            'phone_number' => 'required|string'
        ]);

        try {
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

            // Deduct the amount from user balance
            $user->decrement('balance', $request->amount);

            return response()->json([
                'status' => 'success',
                'message' => 'Airtime purchased successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Server Error: ' . $e->getMessage()
            ], 500);
        }
    }
}
 