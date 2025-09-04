<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure we have products first (safety)
        if (Product::count() === 0) {
            $this->call(ProductSeeder::class);
        }

        // 40 orders, each with 1..5 products
        Order::factory()->count(40)->create()->each(function (Order $order) {
            $count = fake()->numberBetween(1, 5);
            $productIds = Product::inRandomOrder()->limit($count)->pluck('id')->all();

            // link via pivot
            $order->products()->sync($productIds);

            // subtotal = sum(prices), no tax/discount
            $subtotal = (float) Product::whereIn('id', $productIds)->sum('price');

            // persist into total_amount
            $order->update(['total_amount' => $subtotal]);
        });
    }
}
