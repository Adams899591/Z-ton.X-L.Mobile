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
        Schema::create('saved_transfers', function (Blueprint $table) {
            $table->id();
            // The ID of the user who is saving this record (the owner of the saved list)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Transaction Reference (e.g., ZTN-78291044) - helpful for searching and receipt generation
            $table->string('reference')->unique();
            
            // Sender details at the time of the transaction
            $table->string('sender_name');
            $table->string('sender_account');
            
            // Receiver details
            $table->string('receiver_name');
            $table->string('receiver_bank');
            $table->string('receiver_account');
            
            // Financial details
            $table->decimal('amount', 15, 2); // Using decimal for currency precision
            $table->string('description')->nullable();
            
            // The date the actual transaction occurred
            $table->dateTime('transaction_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saved_transfers');
    }
};
