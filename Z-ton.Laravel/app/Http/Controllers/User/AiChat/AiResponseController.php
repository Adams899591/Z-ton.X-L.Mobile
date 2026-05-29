<?php

namespace App\Http\Controllers\User\AiChat;

use App\Http\Controllers\Controller;
use App\Models\AiChatMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
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

        $apiKey = config('services.openrouter.api_key');  // Fetch the API key from the configuration file
        $prompt = $request->prompt; // this holds the user message sent

        $response = Http::withoutVerifying()
            ->withHeaders([
            'Authorization' => "Bearer {$apiKey}",
            'Content-Type' => 'application/json',
            'HTTP-Referer' => config('app.url'), // Optional, for OpenRouter rankings
            'X-Title' => config('app.name'),    // Optional
        ])->timeout(60)->post("https://openrouter.ai/api/v1/chat/completions", [
            'model' => 'openrouter/free',
            // "model" => "google/gemma-4-31b-it:free",

            // "model" => "meta-llama/llamma-3.1-8b-instruct:free",
            // "model" => "meta-llama/llamma-3.1-70b-instruct:free",
            // "model" => "mistralai/mistral-7b-instruct:free",
            // "model" => "mistralai/mixtral-8x7b-instruct:free",
            // "model" => "google/gemma-2-9-9b-b-it:free",
            // "model" => "google/gemma-7b-it:free",


            'messages' => [
                ['role' => 'user', 'content' => $prompt]
            ]
        ]);

        // Check if the API call was successful and return the appropriate response
        if ($response->successful()) {
            $data = $response->json();
            $aiText = $data['choices'][0]['message']['content'] ?? 'AI responded, but no text was found.';

            // Use a transaction to ensure both records are saved together
            DB::transaction(function () use ($user, $prompt, $aiText) {
                // Insert the User message into database
                AiChatMessage::create([
                    'user_id' => $user->id,
                    'sender' => 'user',
                    'type' => 'text',
                    'messages' => $prompt,
                    'media_url' => null,
                    'media_public_id' => null,
                ]);

                // Insert the AI response into the database
                AiChatMessage::create([
                    'user_id' => $user->id,
                    'sender' => 'ai',
                    'type' => 'text',
                    'messages' => $aiText,
                    'media_url' => null,
                    'media_public_id' => null,
                ]);
            });

            // return the AI response in a structured format
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
