<?php

namespace App\UseCases\Category;

use App\Enums\VisibilityStatusType;
use App\Models\Category;

class StoreCategoryAction
{
    public function __invoke(array $data): Category
    {
        // Business logic to create a new Category
        // For example:
        return Category::create(
            [
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'is_active' => $data['isActive'] ?? VisibilityStatusType::ACTIVE,
            ]
        );
    }
}
