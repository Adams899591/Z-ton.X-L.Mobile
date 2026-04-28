<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Bank>
 */
class BankFactory extends Factory
{
    // protected $branches = [
    //     'New York Branch, Wall Street',
    //     'London Branch, Oxford Street',
    //     'Tokyo Branch, Shibuya',
    //     'Paris Branch, Champs-Élysées',
    //     'Sydney Branch, George Street',
    //     'Berlin Branch, Friedrichstraße',
    //     'Mumbai Branch, Bandra',
    //     'São Paulo Branch, Paulista Avenue',
    //     'Dubai Branch, Sheikh Zayed Road',
    //     'Singapore Branch, Orchard Road',
    // ];

    /**
     * Define the model's default state.
     * 
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'name' => $this->faker->unique()->company() . ' Bank',
            // 'branch' => $this->faker->randomElement($this->branches),
        ];
    }
}
