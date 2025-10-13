<?php

namespace App\UseCases\Product;

use App\Models\Image;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class UpdateProductAction
{
    public function __invoke(Product $product, array $data): Product
    {
        return DB::transaction(function () use ($product, $data) {
            $updatePayload = [];

            if (array_key_exists('name', $data)) {
                $updatePayload['name'] = $data['name'];
            }

            if (array_key_exists('price', $data)) {
                $updatePayload['price'] = $data['price'];
            }

            if (array_key_exists('categoryId', $data)) {
                $updatePayload['category_id'] = $data['categoryId'];
            }

            if (array_key_exists('isActive', $data)) {
                $updatePayload['is_active'] = $data['isActive'];
            }

            if (array_key_exists('description', $data)) {
                $updatePayload['description'] = $data['description'];
            }

            if (!empty($updatePayload)) {
                $product->update($updatePayload);
            }

            $imagePayload = data_get($data, 'image');

            if (is_array($imagePayload) && !empty($imagePayload)) {
                $image = Image::create([
                    'provider'  => 'cloudinary',
                    'public_id' => data_get($imagePayload, 'public_id'),
                    'url'       => data_get($imagePayload, 'url'),
                    'format'    => data_get($imagePayload, 'format'),
                    'width'     => data_get($imagePayload, 'width'),
                    'height'    => data_get($imagePayload, 'height'),
                    'bytes'     => data_get($imagePayload, 'bytes'),
                ]);

                $product->update(['image_id' => $image->id]);
            }

            return $product->refresh()->load(['image', 'category']);
        });
    }
}
