<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\DeleteOrderRequest;
use App\Http\Requests\Order\FetchOrderRequest;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Requests\Order\UpdateOrderRequest;
use App\Http\Resources\Order\OrderResource;
use App\UseCases\Order\DeleteOrderAction;
use App\UseCases\Order\DetailOrderAction;
use App\UseCases\Order\GetOrderAction;
use App\UseCases\Order\StoreOrderAction;
use App\UseCases\Order\UpdateOrderAction;
use App\Models\Order;

class OrderController extends Controller
{
    /** GET /staff/Orders */
    public function index(FetchOrderRequest $request)
    {
        $validated = $request->safe()->all();
        $data = (new GetOrderAction())($validated);
        return $data;
    }

    /** GET /staff/Orders/{Order} */
    public function show(Order $order)
    {
        $data = (new DetailOrderAction())($order);
        return ResponseHelper::success(
            "Success",
            new OrderResource($data)
        );
    }

    /** POST /staff/Orders */
    public function store(StoreOrderRequest $request)
    {
        $validated = $request->safe()->all();
        $Order = (new StoreOrderAction())($validated);

        return ResponseHelper::success(
            "Order created successfully",
            new OrderResource($Order),
            201
        );
    }

    /** PUT/PATCH /staff/Orders/{Order} */
    public function update(UpdateOrderRequest $request, Order $Order)
    {
        $validated = $request->safe()->all();
        $data = (new UpdateOrderAction())($Order, $validated);

        return ResponseHelper::success(
            "Order updated successfully",
            new OrderResource($data)
        );
    }

    /** DELETE /staff/Orders/{Order} */
    public function destroy(Order $order, DeleteOrderRequest $request)
    {
        $validated = $request->safe()->all();
        (new DeleteOrderAction())($order, $validated);

        return ResponseHelper::success(
            "Order deleted successfully",
            null
        );
    }
}
