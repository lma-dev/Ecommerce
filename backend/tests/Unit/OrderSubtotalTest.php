<?php

namespace Tests\Unit;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderSubtotalTest extends TestCase
{
    use RefreshDatabase;

    public function test_subtotal_sums_product_prices(): void
    {
        $order = Order::factory()->create();
        $p1 = Product::factory()->create(['price' => 10]);
        $p2 = Product::factory()->create(['price' => 20]);
        $order->products()->sync([$p1->id, $p2->id]);

        $this->assertEquals(30.0, $order->subtotal());
        $this->assertEquals(30.0, $order->subtotal); // accessor
    }
}
