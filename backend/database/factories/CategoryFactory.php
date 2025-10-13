<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $names = [
            'Beverages',
            'Snacks',
            'Staples',
            'Canned & Instant',
            'Dairy & Eggs',
            'Bakery',
            'Household',
            'Personal Care',
        ];

        // Avoid using unique() over a small fixed pool to prevent exhaustion
        $name = $this->faker->randomElement($names);

        return [
            'name' => $name,
            'description' => $this->faker->sentence(),
        ];
    }
}
