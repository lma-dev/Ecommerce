<?php

namespace Tests\Feature\Customer;

use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrdersTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsCustomer(): Customer
    {
        $customer = Customer::factory()->create();
        Sanctum::actingAs($customer);
        return $customer;
    }

    public function test_index_own_orders(): void
    {
        $customer = $this->actingAsCustomer();
        // Create orders for this and another customer
        Order::factory()->create(['customer_id' => $customer->id]);
        Order::factory()->create();

        $res = $this->getJson('/api/customer/orders');
        $res->assertOk();
        $this->assertEquals(1, $res->json('meta.totalItems'));
    }

    public function test_store_own_order(): void
    {
        $this->actingAsCustomer();
        $products = Product::factory()->count(2)->create();
        $payload = [
            'productIds' => $products->pluck('id')->all(),
            'shippingAddress' => 'Mandalay',
        ];
        $res = $this->postJson('/api/customer/orders', $payload);
        $res->assertCreated()->assertJsonStructure(['message','data' => ['id','products']]);
    }
}
