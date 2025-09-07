<?php

namespace App\UseCases\Product;

use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Http\UploadedFile;

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
                    $imageUrl = null;

                    if ($image instanceof UploadedFile) {
                        $directory = public_path('uploads/products');
                        if (! File::exists($directory)) {
                            File::makeDirectory($directory, 0755, true);
                        }

                        $filename = uniqid('product_') . '.' . $image->getClientOriginalExtension();
                        $image->move($directory, $filename);

                        $imageUrl = '/uploads/products/' . $filename;
                    } else {
                        $imageUrl = (string) $image;
                    }

                    // upsert single image
                    $product->image()->updateOrCreate([], ['url' => $imageUrl]);
                } else {
                    // remove image
                    $product->image()->delete();
                }
            }

            return $product->refresh()->load(['image', 'category']);
        });
    }
}
