<?php

namespace App\Http\Controllers\Api\V1;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Product\FetchProductRequest;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\Product\ProductResource;
use App\UseCases\Product\DeleteProductAction;
use App\UseCases\Product\DetailProductAction;
use App\UseCases\Product\GetProductAction;
use App\UseCases\Product\StoreProductAction;
use App\UseCases\Product\UpdateProductAction;
use App\Models\Product;

class ProductController extends Controller
{
    /** GET /staff/Products */
    public function index(FetchProductRequest $request)
    {
        $validated = $request->safe()->all();
        $data = (new GetProductAction())($validated);
        return $data;
    }

    /** GET /staff/Products/{Product} */
    public function show(Product $Product)
    {
        $data = (new DetailProductAction())($Product);
        return ResponseHelper::success(
            "Success",
            new ProductResource($data)
        );
    }

    /** POST /staff/Products */
    public function store(StoreProductRequest $request)
    {
        $validated = $request->safe()->all();
        $Product = (new StoreProductAction())($validated);

        return ResponseHelper::success(
            "Product created successfully",
            new ProductResource($Product),
            201
        );
    }

    /** PUT/PATCH /staff/Products/{Product} */
    public function update(UpdateProductRequest $request, Product $Product)
    {
        $validated = $request->safe()->all();
        $data = (new UpdateProductAction())($Product, $validated);

        return ResponseHelper::success(
            "Product updated successfully",
            new ProductResource($data)
        );
    }

    /** DELETE /staff/Products/{Product} */
    public function destroy(Product $Product)
    {
        $data = (new DeleteProductAction())($Product);

        return ResponseHelper::success(
            "Product deleted successfully",
            new ProductResource($data)
        );
    }
}
