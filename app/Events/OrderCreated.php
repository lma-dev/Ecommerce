<?php

namespace App\Events;

use App\Http\Resources\Order\OrderResource;
use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Http\Request;

class OrderCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Order $order)
    {
        // Ensure relationships are available for payload
        $this->order->loadMissing(['customer', 'products']);
    }

    public function broadcastOn(): Channel
    {
        // Public channel for simplicity; switch to PrivateChannel for auth
        return new Channel('orders');
    }

    public function broadcastAs(): string
    {
        return 'OrderCreated';
    }

    public function broadcastWith(): array
    {
        // Use existing API serializer for consistency
        return OrderResource::make($this->order)->toArray(app(Request::class));
    }
}
