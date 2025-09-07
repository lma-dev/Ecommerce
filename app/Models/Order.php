<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory, Notifiable, HasApiTokens, SoftDeletes;

    protected $guarded = [];
    /**
     * Get the products associated with the order.
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'order_product');
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function subtotal(): float
    {
        // Efficient: sums directly in SQL via the relation (no loading)
        return (float) $this->products()->sum('price');
    }

    // Optional accessor if you want $order->subtotal attribute:
    protected $appends = ['subtotal'];
    public function getSubtotalAttribute(): float
    {
        return $this->subtotal();
    }
}
