<?php

namespace Tests\Unit\Events;

use App\Enums\OrderStatusType;
use App\Events\OrderCreated;
use App\Events\OrderDeleted;
use App\Events\OrderUpdated;
use App\Http\Resources\Order\OrderResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Tests\TestCase;

class OrderBroadcastEventsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->configureBroadcastChannels();
    }

    public function test_order_created_event_broadcasts_expected_channels_and_payload(): void
    {
        $order = $this->createOrderWithProducts();

        $event = new OrderCreated($order);

        $this->assertSame('OrderCreated', $event->broadcastAs());
        $this->assertSame(
            $this->expectedChannels($order->customer_id),
            $this->stringifyChannels($event->broadcastOn())
        );

        $expectedPayload = json_decode(json_encode(OrderResource::make($order)), true);

        $this->assertSame($expectedPayload, json_decode(json_encode($event->broadcastWith()), true));
    }

    public function test_order_updated_event_broadcasts_expected_channels_and_payload(): void
    {
        $order = $this->createOrderWithProducts();
        $order->status = OrderStatusType::COMPLETED->value;
        $order->save();

        $event = new OrderUpdated($order);

        $this->assertSame('OrderUpdated', $event->broadcastAs());
        $this->assertSame(
            $this->expectedChannels($order->customer_id),
            $this->stringifyChannels($event->broadcastOn())
        );

        $expectedPayload = json_decode(json_encode(OrderResource::make($order)), true);

        $this->assertSame($expectedPayload, json_decode(json_encode($event->broadcastWith()), true));
    }

    public function test_order_deleted_event_carries_customer_specific_channels_when_known(): void
    {
        $order = $this->createOrderWithProducts();

        $event = new OrderDeleted($order->id, $order->customer_id);

        $this->assertSame('OrderDeleted', $event->broadcastAs());
        $this->assertSame(
            $this->expectedChannels($order->customer_id),
            $this->stringifyChannels($event->broadcastOn())
        );

        $this->assertSame([
            'id' => $order->id,
            'deleted' => true,
            'customer_id' => $order->customer_id,
        ], $event->broadcastWith());
    }

    public function test_order_deleted_event_targets_admin_channel_when_customer_missing(): void
    {
        $order = $this->createOrderWithProducts();

        $event = new OrderDeleted($order->id, null);

        $this->assertSame(
            $this->expectedChannels(null),
            $this->stringifyChannels($event->broadcastOn())
        );

        $this->assertSame([
            'id' => $order->id,
            'deleted' => true,
        ], $event->broadcastWith());
    }

    private function configureBroadcastChannels(): void
    {
        config([
            'order_broadcast.admin_channel' => 'orders',
            'order_broadcast.customer_channel_prefix' => 'orders.customer.',
            'order_broadcast.additional_customer_channel_prefixes' => ['orders.'],
        ]);
    }

    private function createOrderWithProducts(): Order
    {
        $order = Order::factory()->create(['total_amount' => 0]);

        $products = collect();

        foreach (range(1, 2) as $index) {
            $products->push(Product::factory()->create([
                'name' => 'Test Product '.$index.' '.Str::uuid(),
            ]));
        }

        $pivotData = [];
        foreach ($products as $index => $product) {
            $pivotData[$product->id] = ['quantity' => $index + 1];
        }

        $order->products()->attach($pivotData);

        $order->update(['total_amount' => $products->sum('price')]);

        return $order->fresh()->load(['customer', 'products']);
    }

    /**
     * @param  array<int, \Illuminate\Broadcasting\Channel>  $channels
     * @return array<int, string>
     */
    private function stringifyChannels(array $channels): array
    {
        return array_map(static fn ($channel) => (string) $channel, $channels);
    }

    private function expectedChannels(?int $customerId): array
    {
        $channels = ['private-'.config('order_broadcast.admin_channel')];

        if ($customerId === null) {
            return $channels;
        }

        $prefixes = array_unique(array_merge(
            [config('order_broadcast.customer_channel_prefix')],
            config('order_broadcast.additional_customer_channel_prefixes', [])
        ));

        foreach ($prefixes as $prefix) {
            if ($prefix === '') {
                continue;
            }

            $channels[] = 'private-'.$prefix.$customerId;
        }

        return $channels;
    }
}
