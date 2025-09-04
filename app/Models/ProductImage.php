<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class ProductImage extends Model
{

    /** @use HasFactory<\Database\Factories\ProductImageFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = ['product_id', 'url'];
    /**
     * Get the product associated with the image.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
