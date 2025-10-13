<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\FetchCustomerRequest;
use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use App\Http\Resources\Customer\CustomerResource;
use App\UseCases\Customer\DeleteCustomerAction;
use App\UseCases\Customer\DetailCustomerAction;
use App\UseCases\Customer\GetCustomerAction;
use App\UseCases\Customer\StoreCustomerAction;
use App\UseCases\Customer\UpdateCustomerAction;
use App\Models\Customer;

class CustomerController extends Controller
{
    /** GET /staff/customers */
    public function index(FetchCustomerRequest $request)
    {
        $validated = $request->safe()->all();
        $data = (new GetCustomerAction())($validated);
        return $data;
    }

    /** GET /staff/customers/{customer} */
    public function show(Customer $customer)
    {
        $data = (new DetailCustomerAction())($customer);
        return ResponseHelper::success(
            "Success",
            new CustomerResource($data)
        );
    }

    /** POST /staff/customers */
    public function store(StoreCustomerRequest $request)
    {
        $validated = $request->safe()->all();
        $customer = (new StoreCustomerAction())($validated);

        return ResponseHelper::success(
            "Customer created successfully",
            new CustomerResource($customer),
            201
        );
    }

    /** PUT/PATCH /staff/customers/{customer} */
    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $validated = $request->safe()->all();
        $data = (new UpdateCustomerAction())($customer, $validated);

        return ResponseHelper::success(
            "Customer updated successfully",
            new CustomerResource($data)
        );
    }

    /** DELETE /staff/customers/{customer} */
    public function destroy(Customer $customer)
    {
        $data = (new DeleteCustomerAction())($customer);

        return ResponseHelper::success(
            "Customer deleted successfully",
            null
        );
    }
}
