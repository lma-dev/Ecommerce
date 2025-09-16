<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Curated mini shop item names grouped by rough category
        $itemsByCategory = [
            'Beverages' => [
                'Myanmar Tea Mix', 'Coffee 3-in-1', 'Milo Pack', 'Coca-Cola 1.25L', 'Sprite 1.25L', 'Bottled Water 1L'
            ],
            'Snacks' => [
                'Potato Chips', 'Prawn Crackers', 'Wafer Sticks', 'Chocolate Bar', 'Peanut Snacks'
            ],
            'Staples' => [
                'Premium Rice 1kg', 'Cooking Oil 1L', 'Sugar 1kg', 'Iodized Salt 500g', 'Wheat Flour 1kg'
            ],
            'Canned & Instant' => [
                'Instant Noodles', 'Canned Tuna', 'Canned Beans', 'Tomato Paste', 'Curry Paste Sachet'
            ],
            'Dairy & Eggs' => [
                'Fresh Milk 1L', 'Condensed Milk', 'Cheddar Cheese', 'Salted Butter'
            ],
            'Bakery' => [
                'White Bread Loaf', 'Sweet Buns', 'Crackers Pack'
            ],
            'Household' => [
                'Laundry Detergent', 'Dishwashing Liquid', 'Garbage Bags', 'Toilet Paper 10s'
            ],
            'Personal Care' => [
                'Shampoo 200ml', 'Bath Soap', 'Toothpaste 140g', 'Toothbrush', 'Face Tissue Pack'
            ],
        ];

        // Decide category name and ensure FK exists
        $categoryName = $this->faker->randomElement(array_keys($itemsByCategory));
        $category = Category::firstOrCreate(['name' => $categoryName], [
            'description' => $this->faker->sentence(),
        ]);

        // Do not use unique() on small pools; handle uniqueness manually
        $baseName = $this->faker->randomElement($itemsByCategory[$categoryName]);
        $name = $baseName;
        // Avoid DB unique constraint collisions if base name already exists
        if (Product::where('name', $name)->exists()) {
            $name = $baseName.' '. $this->faker->randomElement(['Mini','Classic','Original','Family Pack','Value']) . ' ' . $this->faker->numerify('##');
        }

        return [
            'name'        => $name,
            // Price in kyat (unsigned integer column). Keep realistic ranges.
            'price'       => $this->faker->numberBetween(300, 15000),
            'category_id' => $category->id,
            // DB uses enum strings 'ACTIVE'|'INACTIVE'
            'is_active'   => $this->faker->boolean(85) ? 'ACTIVE' : 'INACTIVE',
            'description' => $this->faker->optional()->sentence(),
        ];
    }
}
