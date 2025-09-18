<?php

namespace App\Events\Concerns;

use Illuminate\Broadcasting\PrivateChannel;

/**
 * Shared helpers for computing the private channels used by order broadcasts.
 */
trait BroadcastsOrderChannels
{
    /**
     * Build the list of private channels that should receive an order event.
     *
     * @return array<int, PrivateChannel>
     */
    protected function orderBroadcastChannels(?int $customerId): array
    {
        $channels = [new PrivateChannel(config('order_broadcast.admin_channel'))];

        if ($customerId !== null) {
            $prefixes = array_unique(array_merge(
                [config('order_broadcast.customer_channel_prefix')],
                config('order_broadcast.additional_customer_channel_prefixes', [])
            ));

            foreach ($prefixes as $prefix) {
                if ($prefix === '') {
                    continue;
                }

                $channels[] = new PrivateChannel($prefix . $customerId);
            }
        }

        return $channels;
    }
}
