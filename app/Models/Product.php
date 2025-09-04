<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory, Notifiable, HasApiTokens, SoftDeletes;

    protected $fillable = ['name', 'price', 'discount', 'category_id', 'is_active'];

    protected $casts = [
        'price'     => 'decimal:2',
        'discount'  => 'decimal:2',
        'is_active' => 'bool',
    ];

    public function image(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    /**
     * Get the orders associated with the product.
     */
    public function orders(): BelongsToMany
    {
        return $this->belongsToMany(Order::class, 'order_product')->withTimestamps();
    }
}
