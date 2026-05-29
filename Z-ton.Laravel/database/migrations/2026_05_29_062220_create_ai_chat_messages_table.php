<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ai_chat_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Who sent the message (user or the AI)
            $table->enum('sender', ['user', 'ai'])->default('user');
            
            // Defines how to parse the message content (text, image, or audio)
            $table->enum('type', ['text', 'image', 'audio'])->default('text');
            
            // text_content: Stores the raw text for "text" type messages or prompts
            $table->text('messages')->nullable();
            
            // Media Columns (Supabase Integration)
            // Storing the full URI for playback/rendering and public_id for storage management
            $table->string('media_url', 1024)->nullable(); 
            $table->string('media_public_id')->nullable();
            
            $table->timestamps(); // created_at serves as our message timestamp
   
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_chat_messages');
    }
};
