<?php

namespace App\UseCases\Order;

use App\Models\Order;

class DetailOrderAction
{
    public function __invoke(Order $order)
    {
        $order->load(['products.image']);
        return $order;
    }
}
