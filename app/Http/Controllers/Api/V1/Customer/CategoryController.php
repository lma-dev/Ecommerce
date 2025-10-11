<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Enums\AppModeType;
use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Category\FetchCategoryRequest;
use App\Http\Resources\Category\CategoryResource;
use App\Models\Category;
use App\UseCases\Category\DetailCategoryAction;
use App\UseCases\Category\GetCategoryAction;

class CategoryController extends Controller
{
    /** GET /customer/categories */
    public function index(FetchCategoryRequest $request)
    {
        $validated = $request->safe()->all();
        return (new GetCategoryAction())($validated, AppModeType::CUSTOMER_MODE->value);
    }

    /** GET /customer/categories/{category} */
    public function show(Category $category)
    {
        $data = (new DetailCategoryAction())($category);
        return ResponseHelper::success('Success', new CategoryResource($data));
    }
}
