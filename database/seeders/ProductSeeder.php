<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Product::factory()->count(60)->create()->each(function (Product $p) {
            $p->image()->updateOrCreate([], [
                'url' => fake()->imageUrl(800, 800, 'product', true),
            ]);
        });
    }
}
