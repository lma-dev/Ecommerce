<?php

namespace App\UseCases\Product;

use App\Helpers\ResponseHelper;
use App\Http\Resources\Product\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;

class GetProductAction
{
    public function __invoke(array $data): JsonResponse
    {

        $data = $this->ProductFilter($data);
        $meta = ResponseHelper::getPaginationMeta($data);

        return response()->json([
            'data' => ProductResource::collection($data),
            'meta' => $meta,
        ]);
    }

    private function ProductFilter(array $validatedData): LengthAwarePaginator
    {
        $limit = $validatedData['limit'] ?? 8;
        $page = $validatedData['page'] ?? 1;
        $productName = $validatedData['name'] ?? null;
        $categoryId    = $validatedData['categoryId'] ?? null;

        $products = Product::query()
            ->select(['id', 'name', 'price', 'discount', 'category_id', 'is_active', 'created_at'])
            ->with([
                'category:id,name',                // limit columns on relations too
                'image:id,product_id,url',
            ])
            ->when($productName, fn($q, $name) => $q->where('name', 'like', "%{$name}%"))
            ->when($categoryId, fn($q, $id) => $q->where('category_id', $id))
            ->latest('created_at')
            ->paginate($limit, ['*'], 'page', $page)
            ->withQueryString();

        return $products;
    }
}
