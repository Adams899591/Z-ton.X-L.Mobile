<?php

namespace App\Http\Controllers\User\Ai;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log; // Added for better error logging
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AiResponceController extends Controller
{
    /**
     * Handle the AI response request.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function  sendAiRequest(Request $request)
    {
        $apiKey = "";  
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

        if ($response->successful()) {
            $data = $response->json();
            $aiText = $data['choices'][0]['message']['content'] ?? 'AI responded, but no text was found.';

            return response()->json([
                'status' => 'success',
                'result' => $aiText
            ]);
        }

        Log::error('OpenRouter API call failed', [
            'details' => $response->json(),
            'http_code' => $response->status(),
            'prompt' => $prompt,
            'message' => $response->body(),
        ]);

        return response()->json([
            'status' => 'error',
            'message' => 'API call failed',
            // 'details' => $response->json() ?? ['raw_response' => $response->body()], // Ensure details is an array
            'details' => $response->json() ?? ['raw_response' => $response->body()], // Ensure details is an array
            'http_code' => $response->status()
        ], $response->status());
    }
} 
