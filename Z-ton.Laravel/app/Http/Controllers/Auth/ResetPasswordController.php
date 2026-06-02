<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ResetPasswordController extends Controller
{
    // handles the reset password logic
    public function resetPassword(Request $request)
    {
        $request->validate([
            "email" => "required|email",
            "token" => "required",
            "password" => "required|min:8|confirmed"
        ]);

        // check if the token is valid
        $reset = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

            // if the token is invalid, return an error response
        if (!$reset) {
            return response()->json([
                "status" => "error",
                "message" => "This password reset token is invalid."
            ], 400);
        }

        $user = User::where("email", $request->email)->first();

        if (!$user) {
            return response()->json([
                "status" => "error",
                "message" => "We could not find a user with that email address."
            ], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        // delete the token from the database
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            "status" => "success",
            "message" => "Your password has been reset successfully!"
        ]);
    }
}
