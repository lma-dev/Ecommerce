<?php

namespace App\UseCases\Product;

use App\Enums\AppModeType;
use App\Enums\VisibilityStatusType;
use App\Helpers\ResponseHelper;
use App\Http\Resources\Product\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;

class GetProductAction
{
    public function __invoke(array $data, string $mode = AppModeType::CUSTOMER_MODE->value): JsonResponse
    {
        $isActive = $mode === AppModeType::CUSTOMER_MODE->value ?
            VisibilityStatusType::ACTIVE->value   : null;
        $data = $this->ProductFilter($data, $isActive);
        $meta = ResponseHelper::getPaginationMeta($data);

        return response()->json([
            'data' => ProductResource::collection($data),
            'meta' => $meta,
        ]);
    }

    private function ProductFilter(array $validatedData,  ?string $isActive): LengthAwarePaginator
    {
        $limit = $validatedData['limit'] ?? 14;
        $page = $validatedData['page'] ?? 1;
        $productName = $validatedData['name'] ?? null;
        $categoryId    = $validatedData['categoryId'] ?? null;

        $products = Product::query()
            ->select(['id', 'name', 'price', 'category_id', 'is_active', 'image_id', 'created_at'])
            ->with([
                'category:id,name',                // limit columns on relations too
                'image:id,provider,public_id,url' // limit columns on relations too
            ])
            ->when($productName, fn($q, $name) => $q->where('name', 'like', "%{$name}%"))
            ->when($categoryId, fn($q, $id) => $q->where('category_id', $id))
            ->when($isActive !== null, fn($q) => $q->where('is_active', $isActive))
            ->latest('created_at')
            ->paginate($limit, ['*'], 'page', $page)
            ->withQueryString();

        return $products;
    }
}
