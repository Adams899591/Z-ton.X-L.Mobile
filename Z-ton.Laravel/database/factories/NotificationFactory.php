<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
         $types = [
            ['type' => 'info', 'icon' => 'construct-outline'],
            ['type' => 'warning', 'icon' => 'shield-half-outline'],
            ['type' => 'promo', 'icon' => 'card-outline'],
        ];
        $choice = $this->faker->randomElement($types);
        
        return [
            'title' => $this->faker->sentence(3),
            'message' => $this->faker->paragraph(),
            'icon' => $choice['icon'],
            'type' => $choice['type'],
        ];
    }
}
