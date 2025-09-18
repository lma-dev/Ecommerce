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

class OrderUpdated implements ShouldBroadcast
{
    use BroadcastsOrderChannels;
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Capture the order and load relationships needed by the broadcast payload.
     */
    public function __construct(public Order $order)
    {
        $this->order->loadMissing(['customer', 'products']);
    }

    /**
     * Broadcast the update to admins plus the owning customer's private channel.
     */
    public function broadcastOn(): array
    {
        return $this->orderBroadcastChannels($this->order->customer_id);
    }

    /**
     * Emit a descriptive event name for frontend listeners.
     */
    public function broadcastAs(): string
    {
        return 'OrderUpdated';
    }

    /**
     * Serialize the order consistently with the REST API.
     */
    public function broadcastWith(): array
    {
        return OrderResource::make($this->order)->toArray(app(Request::class));
    }
}
