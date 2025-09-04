<?php

namespace App\UseCases\Category;

use App\Models\Category;

class DetailCategoryAction
{
    public function __invoke(Category $category)
    {
        return $category;
    }
}
