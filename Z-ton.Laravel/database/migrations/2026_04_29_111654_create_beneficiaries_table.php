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
        Schema::create('beneficiaries', function (Blueprint $table) {
            $table->id();
            // sender user id - foreign key referencing the users table
             $table->foreignId('sender_id')->nullable()->constrained("users")->onDelete('cascade');

            // Name of the beneficiary (e.g., "Usman Adams")
            $table->string('receiver_name');

            // Bank name of the beneficiary (e.g., "Z-ton Bank", "Zenith Bank")
            $table->string('receiver_bank');

            // Account number of the beneficiary
            $table->string('receiver_account');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('beneficiaries');
    }
};
