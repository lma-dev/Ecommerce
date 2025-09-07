<?php

namespace App\UseCases\Product;

use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Http\UploadedFile;

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
                $imageUrl = null;

                if ($image instanceof UploadedFile) {
                    $directory = public_path('uploads/products');
                    if (! File::exists($directory)) {
                        File::makeDirectory($directory, 0755, true);
                    }

                    $filename = uniqid('product_') . '.' . $image->getClientOriginalExtension();
                    $image->move($directory, $filename);

                    // Store relative path under public folder
                    $imageUrl = '/uploads/products/' . $filename;
                } else {
                    // If a string URL is provided (e.g., from seeder), keep as-is
                    $imageUrl = (string) $image;
                }

                $product->image()->create(['url' => $imageUrl]);
            }

            return $product->load('image');
        });
    }
}
