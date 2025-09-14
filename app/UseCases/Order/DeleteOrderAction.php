<?php

namespace App\UseCases\Order;

use App\Events\OrderDeleted;
use App\Models\Order;

class DeleteOrderAction
{
    public function __invoke(Order $order, array $data): void
    {
        if ($data['force'] ?? false) {
            $order->forceDelete();
        } else {
            $order->delete(); // soft delete
        }

        // Broadcast deletion with minimal payload (only if broadcaster available)
        $driver = config('broadcasting.default');
        $pusherReady = $driver !== 'pusher' || class_exists(\Pusher\Pusher::class);
        if ($driver !== 'log' && $pusherReady) {
            event(new OrderDeleted($order->id));
        }
    }
}
