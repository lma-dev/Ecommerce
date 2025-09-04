<?php

namespace App\UseCases\Product;

use App\Models\Product;

class DeleteProductAction
{
    public function __invoke(Product $product): void
    {
        if ($product->orders()->exists()) {
            abort(400, 'Cannot delete product with existing orders.');
        }
        $product->delete();
    }
}
