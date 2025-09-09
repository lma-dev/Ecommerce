<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Product\FetchProductRequest;
use App\Http\Resources\Product\ProductResource;
use App\Models\Product;
use App\UseCases\Product\DetailProductAction;
use App\UseCases\Product\GetProductAction;

class ProductController extends Controller
{
    /** GET /customer/products */
    public function index(FetchProductRequest $request)
    {
        $validated = $request->safe()->all();
        return (new GetProductAction())($validated);
    }

    /** GET /customer/products/{product} */
    public function show(Product $product)
    {
        $data = (new DetailProductAction())($product);
        return ResponseHelper::success('Success', new ProductResource($data->load(['category', 'image'])));
    }
}
