<?php

namespace App\UseCases\Customer;

use App\Models\Customer;

class StoreCustomerAction
{
    public function __invoke(array $data): Customer
    {
        // Business logic to create a new Customer
        // For example:
        return Customer::create($data);
    }
}
