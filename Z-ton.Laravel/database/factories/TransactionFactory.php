<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Map categories to specific titles for realistic data
        $dataMapping = [
            'Transfer' => ['Transfer to ' . $this->faker->name(), 'Internal Transfer'],
            'Deposit'  => ['Salary Deposit', 'Account Funding', 'Cash Deposit'],
            'Bills'    => ['Electric bill', 'Water bill', 'Cable TV Subscription'],
            'Airtime'  => ['Mtn Airtime Top-Up', 'Airtel Airtime Purchase', 'Data Bundle'],
            'Refund'   => ['Refund from Amazon', 'Refund from Apple', 'Store Refund'],
        ];

        $category = $this->faker->randomElement(array_keys($dataMapping));
        $title = $this->faker->randomElement($dataMapping[$category]);

        return [
            'sender_id' => User::factory(),
            'receiver_id' => User::factory(),
            'title' => $title,
            'category' => $category,
            'status' => 'completed',
            'amount' => $this->faker->randomFloat(2, 50, 10000),
            'description' => $title . ' via Z-ton Mobile',
            'reference' => 'ZTN-' . strtoupper($this->faker->bothify('??###?#?')),
        ];
    }
}
