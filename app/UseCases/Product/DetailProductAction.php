<?php

namespace App\UseCases\Product;

use App\Models\Product;

class DetailProductAction
{
    public function __invoke(Product $product)
    {
        return $product->load('image');
    }
}
