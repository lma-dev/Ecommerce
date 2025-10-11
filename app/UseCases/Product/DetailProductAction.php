<?php

namespace App\UseCases\Product;

use App\Enums\AppModeType;
use App\Models\Product;

class DetailProductAction
{
    public function __invoke(Product $product, string $mode = AppModeType::CUSTOMER_MODE->value): Product
    {
        if ($mode === AppModeType::CUSTOMER_MODE->value && !$product->is_active) {
            abort(404, 'Product not found');
        }
        return $product->load(['image', 'category']);
    }
}
