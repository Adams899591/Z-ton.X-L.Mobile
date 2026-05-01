<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'remember_token' => Str::random(10),
            'name' => $this->faker->name(),
            'bank_id' => \App\Models\Bank::inRandomOrder()->first()->id ?? 1, // Pick random existing bank
            'email' => $this->faker->unique()->safeEmail(),
            'account_type' => $this->faker->randomElement(['Savings Account', 'Current Account', 'Fixed Deposit']),
            'currency' => 'USD',
            'status' => $this->faker->randomElement(['Active', 'Inactive', 'Suspended']),
            'phone' => $this->faker->numerify('##########'), // 10 digits
            'account_number' => $this->faker->numerify('##########'), // 10 digits
            "network_id" => \App\Models\Network::inRandomOrder()->first()->id ?? 1, // Pick random existing network
            'bvn' => $this->faker->numerify('###########'), // 11 digits
            'nin' => $this->faker->numerify('###########'), // 11 digits
            'password' => Hash::make('password'),
            'balance' => $this->faker->randomFloat(2, 1000, 500000),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
