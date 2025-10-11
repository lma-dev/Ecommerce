<?php

namespace App\UseCases\Category;

use App\Enums\AppModeType;
use App\Enums\VisibilityStatusType;
use App\Helpers\ResponseHelper;
use App\Http\Resources\Category\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;

class GetCategoryAction
{
    public function __invoke(array $data, string $mode = AppModeType::CUSTOMER_MODE->value): JsonResponse
    {
        $isActive = $mode === AppModeType::CUSTOMER_MODE->value ?
            VisibilityStatusType::ACTIVE->value   : null;
        $data = $this->CategoryFilter($data, $isActive);
        $meta = ResponseHelper::getPaginationMeta($data);

        return response()->json([
            'data' => CategoryResource::collection($data),
            'meta' => $meta,
        ]);
    }

    private function CategoryFilter(array $validatedData,  ?string $isActive): LengthAwarePaginator
    {
        $limit       = (int) ($validatedData['limit'] ?? 8);
        $page        = (int) ($validatedData['page'] ?? 1);
        $name        = $validatedData['name'] ?? null;

        return Category::query()
            ->when(
                $name,
                fn($q, $n) =>
                $q->where('name', 'like', "%{$n}%")
            )

            ->when($isActive !== null, fn($q) => $q->where('is_active', $isActive))
            ->latest('created_at')
            ->paginate($limit, ['*'], 'page', $page)
            ->withQueryString();
    }
}
