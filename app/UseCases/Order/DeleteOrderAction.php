<?php

namespace App\UseCases\Order;

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
    }
}
