<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
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

        foreach ($names as $name) {
            Category::updateOrCreate(
                ['name' => $name],
                ['description' => fake()->sentence()]
            );
        }
    }
}
