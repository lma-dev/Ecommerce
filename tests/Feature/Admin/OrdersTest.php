<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRoleType;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrdersTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsAdmin(): User
    {
        /** @var User $user */
        $user = User::factory()->create(['role' => UserRoleType::ADMIN->value]);
        Sanctum::actingAs($user);
        return $user;
    }

    public function test_index_lists_orders(): void
    {
        $this->actingAsAdmin();
        Order::factory()->count(3)->create();

        $res = $this->getJson('/api/staff/orders');
        $res->assertOk()->assertJsonStructure([
            'data',
            'meta',
        ]);
    }

    public function test_store_creates_order_with_products(): void
    {
        $this->actingAsAdmin();
        $customer = Customer::factory()->create();
        $products = Product::factory()->count(2)->create();

        $payload = [
            'customerId' => $customer->id,
            'productIds' => $products->pluck('id')->all(),
            'status' => 'PENDING',
            'notes' => 'Test order',
            'shippingAddress' => 'Yangon',
        ];

        $res = $this->postJson('/api/staff/orders', $payload);
        $res->assertCreated()->assertJsonStructure(['message', 'data' => ['id', 'products']]);
    }

    public function test_show_returns_order(): void
    {
        $this->actingAsAdmin();
        $order = Order::factory()->create();
        $res = $this->getJson("/api/staff/orders/{$order->id}");
        $res->assertOk()->assertJsonStructure(['message','data' => ['id','status']]);
    }

    public function test_update_modifies_order(): void
    {
        $this->actingAsAdmin();
        $order = Order::factory()->create();
        $res = $this->patchJson("/api/staff/orders/{$order->id}", [
            'notes' => 'Updated notes',
        ]);
        $res->assertOk();
        $this->assertDatabaseHas('orders', ['id' => $order->id, 'notes' => 'Updated notes']);
    }

    public function test_destroy_deletes_order(): void
    {
        $this->actingAsAdmin();
        $order = Order::factory()->create();
        $res = $this->deleteJson("/api/staff/orders/{$order->id}");
        $res->assertOk();
        $this->assertSoftDeleted('orders', ['id' => $order->id]);
    }

    public function test_index_handles_large_dataset(): void
    {
        $this->actingAsAdmin();

        $customer = Customer::factory()->create([
            'email' => 'bulk-orders@example.com',
            'password' => password_hash('password', PASSWORD_BCRYPT),
        ]);

        Order::factory()
            ->count(70)
            ->for($customer, 'customer')
            ->create();

        $response = $this->getJson('/api/staff/orders?limit=40');

        $response->assertOk()->assertJsonPath('meta.totalItems', 70);

        $this->assertSame(40, count($response->json('data')));
    }
}
