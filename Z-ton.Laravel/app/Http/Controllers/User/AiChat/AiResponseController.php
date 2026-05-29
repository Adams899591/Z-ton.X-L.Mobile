<?php

namespace App\Http\Controllers\User\AiChat;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class AiResponseController extends Controller
{
    //
    public function handlesUserAiChatRequest($userId){
         $user = User::findOrFail($userId);

        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'User not found.'], 404);
        }

        
    }


}
