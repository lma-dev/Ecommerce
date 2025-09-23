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
        $catalog = [
            'Beverages' => [
                ['Myanmar Tea Mix', 1200], ['Coffee 3-in-1', 1800], ['Milo Pack', 2500],
                ['Coca-Cola 1.25L', 1800], ['Sprite 1.25L', 1800], ['Bottled Water 1L', 500],
            ],
            'Snacks' => [
                ['Potato Chips', 1500], ['Prawn Crackers', 1000], ['Wafer Sticks', 1200],
                ['Chocolate Bar', 1200], ['Peanut Snacks', 800],
            ],
            'Staples' => [
                ['Premium Rice 1kg', 2500], ['Cooking Oil 1L', 5200], ['Sugar 1kg', 1800],
                ['Iodized Salt 500g', 400], ['Wheat Flour 1kg', 1800],
            ],
            'Canned & Instant' => [
                ['Instant Noodles', 600], ['Canned Tuna', 3500], ['Canned Beans', 2200],
                ['Tomato Paste', 1500], ['Curry Paste Sachet', 800],
            ],
            'Dairy & Eggs' => [
                ['Fresh Milk 1L', 3200], ['Condensed Milk', 1800], ['Cheddar Cheese', 5200],
                ['Salted Butter', 4500],
            ],
            'Bakery' => [
                ['White Bread Loaf', 1500], ['Sweet Buns', 1000], ['Crackers Pack', 1200],
            ],
            'Household' => [
                ['Laundry Detergent', 3800], ['Dishwashing Liquid', 2200], ['Garbage Bags', 1500],
                ['Toilet Paper 10s', 2800],
            ],
            'Personal Care' => [
                ['Shampoo 200ml', 2500], ['Bath Soap', 800], ['Toothpaste 140g', 1800],
                ['Toothbrush', 700], ['Face Tissue Pack', 1200],
            ],
        ];

        $curatedCount = 0;
        foreach ($catalog as $categoryName => $items) {
            $category = \App\Models\Category::firstOrCreate(['name' => $categoryName], [
                'description' => fake()->sentence(),
            ]);

            foreach ($items as [$name, $price]) {
                /** @var Product $p */
                $p = Product::updateOrCreate(
                    ['name' => $name],
                    [
                        'price' => $price,
                        'category_id' => $category->id,
                        'is_active' => 'ACTIVE',
                        'description' => fake()->optional()->sentence(),
                    ]
                );

                $p->image()->updateOrCreate([], [
                    'url' => 'https://via.placeholder.com/800x800.png?text=' . urlencode($name),
                ]);
                $curatedCount++;
            }
        }

        // Target total of 100 products max
        $remaining = max(0, 100 - $curatedCount);
        for ($i = 1; $i <= $remaining; $i++) {
            $p = Product::factory()->create([
                'name' => 'Extra Item '.$i,
            ]);
            $p->image()->updateOrCreate([], [
                'url' => fake()->imageUrl(800, 800, 'product', true),
            ]);
        }
    }
}
