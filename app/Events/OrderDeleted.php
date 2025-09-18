<?php

namespace App\Events;

use App\Events\Concerns\BroadcastsOrderChannels;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderDeleted implements ShouldBroadcast
{
    use BroadcastsOrderChannels;
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Capture the identifiers needed to broadcast the deletion event.
     */
    public function __construct(public int $orderId, public ?int $customerId = null)
    {
        // Only minimal payload is required for delete
    }

    /**
     * Broadcast the deletion to admins and (if applicable) the owning customer.
     */
    public function broadcastOn(): array
    {
        return $this->orderBroadcastChannels($this->customerId);
    }

    /**
     * Emit the custom event alias consumed by frontend listeners.
     */
    public function broadcastAs(): string
    {
        return 'OrderDeleted';
    }

    /**
     * Provide the minimal payload necessary for clients to prune the order.
     */
    public function broadcastWith(): array
    {
        $payload = [
            'id' => $this->orderId,
            'deleted' => true,
        ];

        if ($this->customerId !== null) {
            $payload['customer_id'] = $this->customerId;
        }

        return $payload;
    }
}
