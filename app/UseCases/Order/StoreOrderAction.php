<?php

namespace App\UseCases\Order;

use App\Enums\OrderStatusType;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class StoreOrderAction
{
    public function __invoke(array $data): Order
    {

        return DB::transaction(function () use ($data) {
            $productIds = $data['productIds'] ?? [];
            $customerId = $data['customerId'] ?? null;
            $status = $data['status'] ?? OrderStatusType::PENDING;
            $notes = $data['notes'] ?? null;
            $shippingAddress = $data['shippingAddress'] ?? null;

            $order = Order::create([
                'customer_id'      => $customerId,
                'status'           => $status,
                'notes'            => $notes,
                'shipping_address' => $shippingAddress,
                'total_amount'     => 0,
            ]);

            $productIds = array_values(array_unique($productIds));
            $order->products()->sync($productIds);

            $subtotal = $order->subtotal();

            // Persist subtotal into total_amount
            $order->update([
                'total_amount'    => $subtotal,
            ]);

            return $order->load('products');
        });
    }
}
