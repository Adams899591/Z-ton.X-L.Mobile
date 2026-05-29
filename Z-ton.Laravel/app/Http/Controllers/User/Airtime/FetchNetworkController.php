<?php

namespace App\Http\Controllers\User\Airtime;

use App\Http\Controllers\Controller;
use App\Models\Network;
use Illuminate\Http\Request;

class FetchNetworkController extends Controller
{

    // Function to fetch all networks
    public function fetchNetwork(){ 

        $network =  Network::all();

        if (!$network) {
          return response()->json(["status" => "error", "message" => "failed to fetch network"]);
        }

        return response()->json(["status" => "success", "network" => $network]);
    }
}
