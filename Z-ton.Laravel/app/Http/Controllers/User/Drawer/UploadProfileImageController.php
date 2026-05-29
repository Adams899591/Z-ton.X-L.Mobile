<?php

namespace App\Http\Controllers\User\Drawer;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UploadProfileImageController extends Controller
{
    // function to handle profile image upload
    public function uploadProfileImage(Request $request, $userId)
    {
       $user = User::findOrFail($userId);

        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'User not found.'], 404);
        }

        // Validate the incoming request to ensure it contains a file
        $request->validate([
            'profile_url' => 'required',
            "profile_public_id" => "required"
        ]);

        $user->update([
            'profile_url' => $request->profile_url,
            "profile_public_id" => $request->profile_public_id,
        ]);

        return response()->json(["status" => "success", "massage" => "profile saved on backend successfully"]);


    }
}
