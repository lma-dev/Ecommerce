<?php

namespace App\UseCases\Order;

use App\Events\OrderDeleted;
use App\Models\Order;

class DeleteOrderAction
{
    /**
     * Remove an order (soft delete by default) and broadcast the deletion event.
     */
    public function __invoke(Order $order, array $data): void
    {
        if ($data['force'] ?? false) {
            $order->forceDelete();
        } else {
            $order->delete(); // soft delete
        }

        // Broadcast deletion with minimal payload (only if broadcaster available)
        $driver = config('broadcasting.default');
        if ($driver !== 'log') {
            event(new OrderDeleted($order->id, $order->customer_id));
        }
    }
}
