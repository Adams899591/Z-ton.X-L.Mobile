<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\ResetPasswordMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class ForgotPasswordController extends Controller
{
    /**
     * Send a reset link to the given user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            "email" => "required|email"
        ]);

        $user = User::where("email", $request->email)->first();
        
        if (!$user) {
            return response()->json([
                "status" => "error",
                "message" => "We could not find a user with that email address."
            ], 404);
        }

        $token =  Str::random(60);

        // delete the email if it already exists in the password_resets table to avoid duplicates
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        // insert the token into the password_resets table
        DB::table('password_reset_tokens')->insert([
            'email' => $user->email,
            'token' => $token,
            'created_at' => now(),
        ]);

        
        //  Note: create a reset link with the token and email as query parameters
        // exp://10.90.251.166:8081/--               => this is the expo development url, you can change it to your production url when you deploy your app
        // pages/views/reset-password                => this is the path to the reset password page in your expo app, you can change it to your own path if you have a different one
        // ?token=$token&email={$request->email}     => these are the query parameters that will be sent to the reset password page, you can change them to your own parameters if you want
         $resetLink = "exp://10.90.251.166:8081/--/pages/views/reset-password?token=$token&email={$request->email}";

        // send email to user with the reset link
        try {
                    // send email to user with the reset link
                   Mail::to($user->email)->send(new ResetPasswordMail($user, $resetLink));

        } catch (\Throwable $th) {
                return response()->json([
                    "status" => "error",
                    "message" => "Connection to the email server failed. Please try again later."
                ]);
        }

        return response()->json([
            "status" => "success",
            "message" => "We have emailed your password reset link!"
        ]);

    }
}
