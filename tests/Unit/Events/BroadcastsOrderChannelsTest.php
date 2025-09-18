<?php

namespace Tests\Unit\Events;

use App\Events\Concerns\BroadcastsOrderChannels;
use Illuminate\Broadcasting\PrivateChannel;
use Tests\TestCase;

class BroadcastsOrderChannelsTest extends TestCase
{
    public function test_builds_private_channels_for_customer(): void
    {
        config([
            'order_broadcast.admin_channel' => 'orders-admin',
            'order_broadcast.customer_channel_prefix' => 'orders.customer.',
            'order_broadcast.additional_customer_channel_prefixes' => [
                'orders.customer.',
                '',
                'orders.alt.',
                'orders.alt.',
            ],
        ]);

        $channels = $this->makeTraitProxy()->channels(42);

        $this->assertContainsOnlyInstancesOf(PrivateChannel::class, $channels);
        $this->assertSame([
            'private-orders-admin',
            'private-orders.customer.42',
            'private-orders.alt.42',
        ], array_map(static fn ($channel) => (string) $channel, $channels));
    }

    public function test_returns_only_admin_channel_when_customer_missing(): void
    {
        config([
            'order_broadcast.admin_channel' => 'orders-admin',
            'order_broadcast.customer_channel_prefix' => 'orders.customer.',
            'order_broadcast.additional_customer_channel_prefixes' => ['orders.alt.'],
        ]);

        $channels = $this->makeTraitProxy()->channels(null);

        $this->assertContainsOnlyInstancesOf(PrivateChannel::class, $channels);
        $this->assertSame([
            'private-orders-admin',
        ], array_map(static fn ($channel) => (string) $channel, $channels));
    }

    public function test_handles_large_number_of_customer_prefixes_without_duplicates(): void
    {
        $additionalPrefixes = [];

        for ($i = 1; $i <= 250; $i++) {
            $additionalPrefixes[] = "orders.segment{$i}.";
        }

        $additionalPrefixes[] = '';
        $additionalPrefixes[] = 'orders.segment10.'; // duplicate entry should be ignored

        config([
            'order_broadcast.admin_channel' => 'orders-admin',
            'order_broadcast.customer_channel_prefix' => 'orders.customer.',
            'order_broadcast.additional_customer_channel_prefixes' => $additionalPrefixes,
        ]);

        $customerId = 99;

        $channels = $this->makeTraitProxy()->channels($customerId);

        $this->assertContainsOnlyInstancesOf(PrivateChannel::class, $channels);

        $stringChannels = array_map(static fn ($channel) => (string) $channel, $channels);

        $this->assertSame('private-orders-admin', $stringChannels[0]);
        $this->assertSame('private-orders.customer.'.$customerId, $stringChannels[1]);
        $this->assertCount(252, $stringChannels); // 1 admin + 1 primary prefix + 250 uniques
        $this->assertSame(count($stringChannels), count(array_unique($stringChannels)));
        $this->assertSame('private-orders.segment250.'.$customerId, $stringChannels[array_key_last($stringChannels)]);
    }

    private function makeTraitProxy(): object
    {
        return new class {
            use BroadcastsOrderChannels;

            /**
             * Expose the trait functionality for testing.
             *
             * @return array<int, PrivateChannel>
             */
            public function channels(?int $customerId): array
            {
                return $this->orderBroadcastChannels($customerId);
            }
        };
    }
}
