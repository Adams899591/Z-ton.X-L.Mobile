<?php

namespace App\Http\Controllers\User\AiChat;

use App\Http\Controllers\Controller;
use App\Models\AiChatMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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
        $type = $request->type ?? 'text'; // Retrieve the message type (text, image, audio)
        
        // Ensure the prompt is never null to avoid the "at least 1 token" error
        // $prompt = $request->input('prompt') ?? ($type === 'image' ? 'Analyze the attached image.' : 'Hello AI');
        $prompt = $request->input('prompt') ?? ($type === 'image' ? 'Analyze the attached image and ask a question about it to keep the conversation going.' : 'Hello AI');   
        $mediaUrl = null; // this will hold the fetched media URL from Supabase

        // If the request contains an image, upload it to Supabase (S3)
        if ($type === 'image' && $request->hasFile('image')) {
            try {
                $file = $request->file('image');

                // Log original file details as requested to debug what Laravel is receiving
                Log::info('Incoming File Details', [
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'size' => $file->getSize(),
                    'is_valid' => $file->isValid(),
                    'temp_path' => $file->getRealPath(), // This is the actual path on your server
                ]);

                // Using the Storage facade directly ensures the file is placed in the 'ai_chat' directory.
                // Specifying 'public' visibility ensures the file is accessible via the public URL.

try {
    $path = Storage::disk('s3')->putFile('ai_chat', $file, 'public');
} catch (\Exception $e) {
    Log::error('S3 putFile exception: ' . $e->getMessage());
    throw $e;
}
                
                Log::info('Supabase Upload Attempt', ['generated_path' => $path]);

                // Only attempt to generate a URL if the path was successfully created
                if ($path) {
                    Log::info('Supabase Upload Successful', ['generated_path' => $path]);
                    $mediaUrl = Storage::disk('s3')->url($path);
                    
                    if (!$mediaUrl) {
                        Log::warning('Upload succeeded but Storage::url() returned empty string.');
                    }
                } else {
                    Log::error('Supabase Upload Failed: Storage::putFile returned false. Check your S3 credentials and endpoint.');
                }
            } catch (\Exception $e) {
                Log::error('Image upload failed: ' . $e->getMessage());
                return response()->json(['status' => 'error', 'message' => 'Failed to upload image.'], 500);
            }
        }

        // Prepare the message content for OpenRouter. Vision models need an array for images.
        if ($type === 'image' && $mediaUrl) {
            $messageContent = [
                ['type' => 'text', 'text' => $prompt],
                ['type' => 'image_url', 'image_url' => ['url' => $mediaUrl]]
            ];
        } else {
            $messageContent = $prompt;
        }

        $response = Http::withoutVerifying()
            ->withHeaders([
            'Authorization' => "Bearer {$apiKey}",
            'Content-Type' => 'application/json',
            'HTTP-Referer' => config('app.url'), // Optional, for OpenRouter rankings
            'X-Title' => config('app.name'),    // Optional
        ])->timeout(60)->post("https://openrouter.ai/api/v1/chat/completions", [
            // 'model' => 'openrouter/free',
            "model" => "google/gemma-4-31b-it:free",
            // 'model' => 'google/gemini-flash-1.5-8b', 

            'messages' => [
                ['role' => 'user', 'content' => $messageContent]
            ]
        ]);

        // Check if the API call was successful and return the appropriate response
        if ($response->successful()) {
            $data = $response->json();
            $aiText = $data['choices'][0]['message']['content'] ?? 'AI responded, but no text was found.';

            // // Use a transaction to ensure both records are saved together
            DB::transaction(function () use ($user, $prompt, $aiText, $type, $mediaUrl) {
                // Insert the User message into the database
                AiChatMessage::create([
                    'user_id' => $user->id,
                    'sender' => 'user',
                    'type' => $type,
                    'messages' => $prompt,
                    'media_url' => ($type === 'image') ? $mediaUrl : null,
                    'media_public_id' => null,
                ]);

                // Insert the AI response into the database
                AiChatMessage::create([
                    'user_id' => $user->id,
                    'sender' => 'ai',
                    'type' => $type,
                    'messages' => $aiText,
                    'media_url' => null,
                    'media_public_id' => null,
                ]);
            });

            // return the AI response in a structured format
            return response()->json([
                'status' => 'success',
                'media_url' => $mediaUrl, // Adding this to help you see the link in your response
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
