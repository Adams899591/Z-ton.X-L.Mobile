<?php

namespace App\Http\Controllers\User\AiChat;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiResponseController extends Controller
{
        /**
     * Handle the AI response request.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */

    // This method is intended to handle AI chat requests for a specific user.
    public function handlesUserAiChatRequest(Request $request, $userId){

         $user = User::findOrFail($userId); // Ensure the user exists, otherwise return a 404 error.

        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'User not found.'], 404);
        }

        
        $apiKey = config('services.openrouter.api_key');  // Fetch the API key from the configuration file
        $prompt = $request->prompt;

        $response = Http::withoutVerifying()
            ->withHeaders([
            'Authorization' => "Bearer {$apiKey}",
            'Content-Type' => 'application/json',
            'HTTP-Referer' => config('app.url'), // Optional, for OpenRouter rankings
            'X-Title' => config('app.name'),    // Optional
        ])->timeout(60)->post("https://openrouter.ai/api/v1/chat/completions", [
            // 'model' => 'openrouter/free',
            "model" => "google/gemma-4-31b-it:free",
            // "model" => "google/gemini-3.5-flash",
            'messages' => [
                ['role' => 'user', 'content' => $prompt]
            ]
        ]);

        // Check if the API call was successful and return the appropriate response
        if ($response->successful()) {
            $data = $response->json();
            $aiText = $data['choices'][0]['message']['content'] ?? 'AI responded, but no text was found.';

            return response()->json([
                'status' => 'success',
                'aiResponse' => $aiText
            ]);
        }

        // Log the error details for debugging purposes
        Log::error('OpenRouter API call failed', [
            'details' => $response->json(),
            'http_code' => $response->status(),
            'prompt' => $prompt,
            'message' => $response->body(),
        ]);

        // Return a structured error response to the client, including details for debugging
        return response()->json([
            'status' => 'error',
            'message' => 'API call failed',
            'details' => $response->json() ?? ['raw_response' => $response->body()], // Ensure details is an array
            'http_code' => $response->status()
        ], $response->status());

        
    }


}
