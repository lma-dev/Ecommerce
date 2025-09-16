<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory, Notifiable, HasApiTokens, SoftDeletes;

    protected $fillable = ['name', 'price', 'description', 'category_id', 'is_active'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function image(): HasOne
    {
        return $this->hasOne(ProductImage::class);
    }

    /**
     * Get the orders associated with the product.
     */
    public function orders(): BelongsToMany
    {
        return $this->belongsToMany(Order::class, 'order_product')
            ->withPivot('quantity')
            ->withTimestamps();
    }
}
