<?php

namespace App\UseCases\Category;

use App\Models\Category;

class DeleteCategoryAction
{
    public function __invoke(Category $category): Category
    {
        // Business logic to delete a Category by ID
        // For example:
        $category->delete();
        return $category;
    }
}
