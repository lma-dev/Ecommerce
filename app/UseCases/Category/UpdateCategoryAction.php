<?php

namespace App\UseCases\Category;

use App\Models\Category;

class UpdateCategoryAction
{
    public function __invoke(Category $category, array $data): Category
    {
        $category->update([
            'name' => $data['name'] ?? $category->name,
            'description' => $data['description'] ?? $category->description,
            'is_active' => $data['isActive'] ?? $category->status,
        ]);
        return $category;
    }
}
