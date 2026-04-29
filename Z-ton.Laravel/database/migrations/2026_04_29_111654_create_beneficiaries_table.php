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
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Name of the beneficiary (e.g., "Usman Adams")
            $table->string('name');

            // Bank name of the beneficiary (e.g., "Z-ton Bank", "Zenith Bank")
            $table->string('bank');

            // Account number of the beneficiary
            $table->string('account');

            // Type of beneficiary (e.g., "Z-ton Bank", "Other Bank", "Own Accounts")
            $table->string('type');
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
