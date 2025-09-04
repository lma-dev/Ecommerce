<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Category\DeleteCategoryRequest;
use App\Http\Requests\Category\FetchCategoryRequest;
use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Resources\Category\CategoryResource;
use App\UseCases\Category\DeleteCategoryAction;
use App\UseCases\Category\DetailCategoryAction;
use App\UseCases\Category\GetCategoryAction;
use App\UseCases\Category\StoreCategoryAction;
use App\UseCases\Category\UpdateCategoryAction;
use App\Models\Category;

class CategoryController extends Controller
{
    /** GET /staff/Categorys */
    public function index(FetchCategoryRequest $request)
    {
        $validated = $request->safe()->all();
        $data = (new GetCategoryAction())($validated);
        return $data;
    }

    /** GET /staff/Categorys/{Category} */
    public function show(Category $category)
    {
        $data = (new DetailCategoryAction())($category);
        return ResponseHelper::success(
            "Success",
            new CategoryResource($data)
        );
    }

    /** POST /staff/Categorys */
    public function store(StoreCategoryRequest $request)
    {
        $validated = $request->safe()->all();
        $category = (new StoreCategoryAction())($validated);

        return ResponseHelper::success(
            "Category created successfully",
            new CategoryResource($category),
            201
        );
    }

    /** PUT/PATCH /staff/Categorys/{Category} */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $validated = $request->safe()->all();
        $data = (new UpdateCategoryAction())($category, $validated);

        return ResponseHelper::success(
            "Category updated successfully",
            new CategoryResource($data)
        );
    }

    /** DELETE /staff/Categorys/{Category} */
    public function destroy(Category $category)
    {
        (new DeleteCategoryAction())($category);

        return ResponseHelper::success(
            "Category deleted successfully",
            null
        );
    }
}
