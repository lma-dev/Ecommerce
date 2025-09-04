<?php

namespace App\UseCases\Product;

use App\Models\Product;
use Illuminate\Support\Facades\DB;

class UpdateProductAction
{
    public function __invoke(Product $product, array $data): Product
    {
        return DB::transaction(function () use ($product, $data) {
            $image = array_key_exists('image', $data) ? $data['image'] : null;
            unset($data['image']);

            if (!empty($data)) {
                $product->update([
                    'name'        => $data['name'],
                    'price'      => $data['price'],
                    'category_id' => $data['categoryId'],
                    'is_active'  => $data['isActive'],
                    'description' => $data['description'],
                ]);
            }

            if ($image !== null) {
                if ($image) {
                    // upsert single image
                    $product->image()->updateOrCreate([], ['url' => $image]);
                } else {
                    // remove image
                    $product->image()->delete();
                }
            }

            return $product->load('image');
        });
    }
}
