<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    protected $guarded = [];
    /**
     * Get the products associated with the category.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
