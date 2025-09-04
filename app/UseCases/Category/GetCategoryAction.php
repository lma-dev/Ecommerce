<?php

namespace App\UseCases\Category;

use App\Helpers\ResponseHelper;
use App\Http\Resources\Category\CategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;

class GetCategoryAction
{
    public function __invoke(array $data): JsonResponse
    {

        $data = $this->CategoryFilter($data);
        $meta = ResponseHelper::getPaginationMeta($data);

        return response()->json([
            'data' => CategoryResource::collection($data),
            'meta' => $meta,
        ]);
    }

    private function CategoryFilter(array $validatedData): LengthAwarePaginator
    {
        $limit       = (int) ($validatedData['limit'] ?? 8);
        $page        = (int) ($validatedData['page'] ?? 1);
        $name        = $validatedData['name'] ?? null;
        $isActive      = $validatedData['isActive'] ?? null;

        return Category::query()
            ->when(
                $name,
                fn($q, $n) =>
                $q->where('name', 'like', "%{$n}%")
            )
            ->when($isActive, fn($q, $r) => $q->where('is_active', $r))

            ->latest('created_at')
            ->paginate($limit, ['*'], 'page', $page)
            ->withQueryString();
    }
}
