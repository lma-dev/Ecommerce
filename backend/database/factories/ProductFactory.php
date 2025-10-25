<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
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
            'Drinks' => [
                'Myanmar Tea Mix',
                'Coffee 3-in-1',
                'Milo Pack',
                'Coca-Cola 1.25L',
                'Sprite 1.25L',
                'Bottled Water 1L'
            ],
            'Snacks' => [
                'Potato Chips',
                'Prawn Crackers',
                'Wafer Sticks',
                'Chocolate Bar',
                'Peanut Snacks'
            ],
            'Fruits' => [
                'Fresh Apples 1kg',
                'Bananas 1kg',
                'Oranges 1kg',
                'Grapes 1kg',
                'Mangoes 1kg'
            ],
            'Meats' => [
                'Chicken Breast 1kg',
                'Ground Beef 1kg',
                'Pork Chops 1kg',
                'Bacon 200g',
                'Sausages 500g'
            ],
            'Tea' => [
                'Green Tea Bags',
                'Black Tea Loose Leaf',
                'Herbal Tea Variety Pack',
                'Oolong Tea 100g',
                'Chamomile Tea 50g'
            ],
            'Bakery' => [
                'White Bread Loaf',
                'Sweet Buns',
                'Crackers Pack'
            ],

        ];

        // Decide category name and ensure FK exists
        $categoryName = $this->faker->randomElement(array_keys($itemsByCategory));
        $category = Category::firstOrCreate(['name' => $categoryName], [
            'description' => $this->faker->sentence(),
        ]);

        $baseName = $this->faker->randomElement($itemsByCategory[$categoryName]);

        do {
            $suffix = Str::upper(Str::random(3)) . $this->faker->numerify('##');
            $name = $baseName . ' ' . $suffix;
        } while (Product::where('name', $name)->exists());

        return [
            'name'        => $name,
            'price'       => $this->faker->numberBetween(300, 15000),
            'category_id' => $category->id,
            'is_active'   => $this->faker->boolean(85) ? 'ACTIVE' : 'INACTIVE',
            'description' => $this->faker->optional()->sentence(),
        ];
    }
}
