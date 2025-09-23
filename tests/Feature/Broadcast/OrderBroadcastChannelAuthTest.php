<?php

namespace Tests\Feature\Broadcast;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderBroadcastChannelAuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'order_broadcast.admin_channel' => 'orders',
            'order_broadcast.customer_channel_prefix' => 'orders.customer.',
            'order_broadcast.additional_customer_channel_prefixes' => ['orders.'],
        ]);
    }

    /**
     * Hit the broadcast auth endpoint with sensible defaults.
     */
    private function postBroadcastAuth(array $overrides = [])
    {
        return $this->postJson('/broadcasting/auth', $overrides + [
            'socket_id' => '1234.5678',
        ]);
    }

    public function test_staff_token_with_staff_ability_can_access_admin_channel(): void
    {
        $staff = User::factory()->create();

        Sanctum::actingAs($staff, ['staff']);

        $this->postBroadcastAuth([
            'channel_name' => 'orders',
        ])->assertOk();
    }

    public function test_staff_token_without_required_ability_is_denied_admin_channel(): void
    {
        $staff = User::factory()->create();

        Sanctum::actingAs($staff, ['inventory']);

        $this->postBroadcastAuth([
            'channel_name' => 'orders',
        ])->assertForbidden();
    }

    public function test_customer_can_only_access_their_own_order_stream(): void
    {
        $customer = Customer::factory()->create();
        $otherCustomer = Customer::factory()->create();

        Sanctum::actingAs($customer);

        $this->postBroadcastAuth([
            'channel_name' => 'orders.customer.'.$customer->getKey(),
        ])->assertOk();

        $this->postBroadcastAuth([
            'channel_name' => 'orders.customer.'.$otherCustomer->getKey(),
        ])->assertForbidden();
    }

    public function test_staff_can_access_any_customer_stream(): void
    {
        $staff = User::factory()->create();
        $customer = Customer::factory()->create();

        Sanctum::actingAs($staff, ['staff']);

        $this->postBroadcastAuth([
            'channel_name' => 'orders.customer.'.$customer->getKey(),
        ])->assertOk();

        $this->postBroadcastAuth([
            'channel_name' => 'orders.'.$customer->getKey(),
        ])->assertOk();
    }

    public function test_customer_can_access_additional_prefix_stream(): void
    {
        $customer = Customer::factory()->create();

        Sanctum::actingAs($customer);

        $this->postBroadcastAuth([
            'channel_name' => 'orders.'.$customer->getKey(),
        ])->assertOk();
    }
}
