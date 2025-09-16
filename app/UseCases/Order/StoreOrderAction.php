<?php

namespace App\UseCases\Order;

use App\Enums\OrderStatusType;
use App\Events\OrderCreated;
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

            // Build product => ['quantity' => count] map from duplicates
            $counts = array_count_values($productIds);
            $sync = [];
            foreach ($counts as $productId => $qty) {
                $sync[$productId] = ['quantity' => (int) $qty];
            }
            $order->products()->sync($sync);

            $subtotal = $order->subtotal();

            // Persist subtotal into total_amount
            $order->update([
                'total_amount'    => $subtotal,
            ]);

            $order = $order->load(['customer', 'products']);

            // Broadcast immediately for real-time admin dashboards (only if broadcaster available)
            $driver = config('broadcasting.default');
            $pusherReady = $driver !== 'pusher' || class_exists(\Pusher\Pusher::class);
            if ($driver !== 'log' && $pusherReady) {
                event(new OrderCreated($order));
            }

            return $order;
        });
    }
}
