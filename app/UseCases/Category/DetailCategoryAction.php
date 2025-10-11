<?php

namespace App\UseCases\Category;

use App\Enums\AppModeType;
use App\Models\Category;

class DetailCategoryAction
{
    public function __invoke(Category $category, ?string $mode = AppModeType::CUSTOMER_MODE->value): Category
    {
        if ($mode === AppModeType::CUSTOMER_MODE->value && !$category->is_active) {
            abort(404, 'Category not found');
        }
        return $category;
    }
}
