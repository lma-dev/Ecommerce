<?php

namespace App\UseCases\Category;

use App\Models\Category;

class DeleteCategoryAction
{
    public function __invoke(Category $category): Category
    {
        $category->delete();
        return $category;
    }
}
