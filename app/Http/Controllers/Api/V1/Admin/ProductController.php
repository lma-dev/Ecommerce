<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\AppModeType;
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
        $data = (new GetProductAction())($validated, AppModeType::ADMIN_MODE->value);
        return $data;
    }

    /** GET /staff/Products/{Product} */
    public function show(Product $product)
    {
        $data = (new DetailProductAction())($product, AppModeType::ADMIN_MODE->value);
        return ResponseHelper::success(
            "Success",
            new ProductResource($data)
        );
    }

    /** POST /staff/Products */
    public function store(StoreProductRequest $request)
    {
        $this->authorize('create', Product::class);

        $validated = $request->safe()->all();
        $product = (new StoreProductAction())($validated);
        return ResponseHelper::success(
            "Product created successfully",
            new ProductResource($product),
            201
        );
    }

    /** PUT/PATCH /staff/Products/{Product} */
    public function update(UpdateProductRequest $request, Product $product)
    {
        $this->authorize('update', $product);

        $validated = $request->safe()->all();
        $data = (new UpdateProductAction())($product, $validated);

        return ResponseHelper::success(
            "Product updated successfully",
            new ProductResource($data)
        );
    }

    /** DELETE /staff/Products/{Product} */
    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);

        (new DeleteProductAction())($product);

        return ResponseHelper::success(
            "Product deleted successfully",
            null
        );
    }
}
