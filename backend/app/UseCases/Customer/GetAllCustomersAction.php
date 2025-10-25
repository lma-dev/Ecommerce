<?php

namespace App\UseCases\Customer;

use App\Models\Customer;
use Illuminate\Http\JsonResponse;

class GetAllCustomersAction
{
    public function __invoke(): JsonResponse
    {
        $customers = Customer::select(['id', 'name'])->get()->toArray();

        return response()->json([
            'data' => $customers,
        ]);
    }
}
