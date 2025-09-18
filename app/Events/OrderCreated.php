<?php

namespace App\Events;

use App\Events\Concerns\BroadcastsOrderChannels;
use App\Http\Resources\Order\OrderResource;
use App\Models\Order;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Http\Request;
use Illuminate\Queue\SerializesModels;

class OrderCreated implements ShouldBroadcast
{
    use BroadcastsOrderChannels;
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Capture the order instance and ensure related data is loaded for the payload.
     */
    public function __construct(public Order $order)
    {
        $this->order->loadMissing(['customer', 'products']);
    }

    /**
     * Broadcast the event to the admin overview channel and the owning customer.
     */
    public function broadcastOn(): array
    {
        return $this->orderBroadcastChannels($this->order->customer_id);
    }

    /**
     * Provide a custom name so frontends can differentiate broadcast types easily.
     */
    public function broadcastAs(): string
    {
        return 'OrderCreated';
    }

    /**
     * Serialize the order using the API resource for consistency with HTTP responses.
     */
    public function broadcastWith(): array
    {
        return OrderResource::make($this->order)->toArray(app(Request::class));
    }
}
