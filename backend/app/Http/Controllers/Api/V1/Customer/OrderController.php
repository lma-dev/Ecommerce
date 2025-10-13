<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\FetchOrderRequest;
use App\Http\Resources\Order\OrderResource;
use App\Models\Order;
use App\UseCases\Order\DetailOrderAction;
use App\UseCases\Order\GetOrderAction;
use App\UseCases\Order\StoreOrderAction;
use App\Http\Requests\Customer\StoreOwnOrderRequest;

class OrderController extends Controller
{
    /** GET /customer/orders */
    public function index(FetchOrderRequest $request)
    {
        $validated = $request->safe()->except(['customerId']);
        $customerId = getAuthCustomerOrFailed()->id;
        return (new GetOrderAction())($validated, (int) $customerId);
    }

    /** GET /customer/orders/{order} */
    public function show(Order $order)
    {
        $customerId = getAuthCustomerOrFailed()->id;
        abort_unless($order->customer_id === $customerId, 404);
        $data = (new DetailOrderAction())($order);
        return ResponseHelper::success('Success', new OrderResource($data->load(['products'])));
    }

    /** POST /customer/orders */
    public function store(StoreOwnOrderRequest $request)
    {
        $validated = $request->validated();
        $validated['customerId'] = getAuthCustomerOrFailed()->id;
        $order = (new StoreOrderAction())($validated);
        return ResponseHelper::success('Order created successfully', new OrderResource($order->load(['products'])), 201);
    }
}
