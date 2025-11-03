<?php

namespace App\UseCases\Order;

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
            $status = array_key_exists('status', $data) ? $data['status'] : null;
            $notes = $data['notes'] ?? null;
            $shippingAddress = $data['shippingAddress'] ?? null;

            $oldProducts = $order->products()->get(['products.id', 'order_product.quantity']);
            $oldProductQuantities = $oldProducts->mapWithKeys(function ($p) {
                return [$p->id => (int) $p->pivot->quantity];
            })->all();

            $order->update(array_filter([
                'customer_id'      => $customerId,
                'status'           => $status,
                'notes'            => $notes,
                'shipping_address' => $shippingAddress,
            ], fn($v) => !is_null($v)));

            if (array_key_exists('productIds', $data)) {
                $counts = array_count_values($productIds);
                $sync = [];
                foreach ($counts as $productId => $qty) {
                    $sync[$productId] = ['quantity' => (int) $qty];
                }
                $order->products()->sync($sync);
                $productQuantities = $counts;
            } else {
                $current = $order->products()->get(['products.id', 'order_product.quantity']);
                $productQuantities = $current->mapWithKeys(function ($p) {
                    return [$p->id => (int) $p->pivot->quantity];
                })->all();
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
                    'product_quantities' => $oldProductQuantities,
                ],
                'new_data'    => [
                    'order'       => $order->only(['id', 'customer_id', 'status', 'notes', 'total_amount']),
                    'product_quantities' => $productQuantities,
                ],
            ]);

            $order = $order->load(['customer', 'products']);

            // Broadcast update for realtime clients (only if broadcaster available)
        $driver = config('broadcasting.default');
        if ($driver !== 'log') {
            event(new OrderUpdated($order));
        }

            return $order;
        });
    }
}
