<?php

namespace App\UseCases\Product;

use App\Enums\VisibilityStatusType;
use App\Models\Image;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class StoreProductAction
{
    public function __invoke(array $data): Product
    {
        return DB::transaction(function () use ($data) {
            $image = Image::create([
                'provider'  => 'cloudinary',
                'public_id' => $data['image']['public_id'],
                'url'       => $data['image']['url'],
                'format'    => $data['image']['format'],
                'width'     => $data['image']['width'],
                'height'    => $data['image']['height'],
                'bytes'     => $data['image']['bytes'],
            ]);

            $product = Product::create([
                'name'        => $data['name'],
                'price'       => $data['price'],
                'category_id' => $data['categoryId'],
                'is_active'   => data_get($data, 'isActive', VisibilityStatusType::ACTIVE->value),
                'description' => data_get($data, 'description'),
                'image_id'    => $image->id,
            ]);

            return $product->load('image');
        });
    }
}
