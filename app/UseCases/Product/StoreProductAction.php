<?php

namespace App\UseCases\Product;

use App\Models\Product;
use Illuminate\Support\Facades\DB;

class StoreProductAction
{
    public function __invoke(array $data): Product
    {
        return DB::transaction(function () use ($data) {
            $image = $data['image'] ?? null;
            unset($data['image']);

            $product = Product::create([
                'name'        => $data['name'],
                'price'       => $data['price'],
                'category_id' => $data['categoryId'],
                'is_active'   => $data['isActive'],
                'description' => $data['description'],
            ]);

            if ($image) {
                $product->image()->create(['url' => $image]);
            }

            return $product->load('image');
        });
    }
}
