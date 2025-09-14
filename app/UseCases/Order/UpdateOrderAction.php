<?php

namespace App\UseCases\Order;

use App\Enums\OrderStatusType;
use App\Events\OrderUpdated;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use Illuminate\Support\Facades\DB;

class UpdateOrderAction
{
    public function __invoke(Order $order, array $data): Order
    {
        return DB::transaction(function () use ($order, $data) {
            $productIds = $data['productIds'] ?? [];
            $customerId = $data['customerId'] ?? null;
            $status = $data['status'] ?? OrderStatusType::PENDING;
            $notes = $data['notes'] ?? null;
            $shippingAddress = $data['shippingAddress'] ?? null;

            $oldProductIds = $order->products()->pluck('products.id')->all();

            $order->update(array_filter([
                'customer_id'      => $customerId,
                'status'           => $status,
                'notes'            => $notes,
                'shipping_address' => $shippingAddress,
            ], fn($v) => !is_null($v)));

            if (array_key_exists('productIds', $data)) {
                $productIds = array_values(array_unique($productIds));
                $order->products()->sync($productIds);
            } else {
                $productIds = $order->products()->pluck('products.id')->all();
            }

            $subtotal = $order->subtotal();

            $order->update([
                'total_amount'    => $subtotal,
            ]);

            OrderStatusHistory::create([
                'order_id'    => $order->id,
                'customer_id' => $order->customer_id,
                'old_data'    => [
                    'order'       => $order->only(['id', 'customer_id', 'status', 'notes', 'total_amount']),
                    'product_ids' => $oldProductIds,
                ],
                'new_data'    => [
                    'order'       => $order->only(['id', 'customer_id', 'status', 'notes', 'total_amount']),
                    'product_ids' => $productIds,
                ],
            ]);

            $order = $order->load(['customer', 'products']);

            // Broadcast update for realtime clients (only if broadcaster available)
            $driver = config('broadcasting.default');
            $pusherReady = $driver !== 'pusher' || class_exists(\Pusher\Pusher::class);
            if ($driver !== 'log' && $pusherReady) {
                event(new OrderUpdated($order));
            }

            return $order;
        });
    }
}
