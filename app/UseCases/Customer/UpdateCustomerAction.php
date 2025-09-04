<?php

namespace App\UseCases\Customer;

use App\Models\Customer;

class UpdateCustomerAction
{
    public function __invoke(Customer $Customer, array $data): Customer
    {
        // Business logic to create a new Customer
        // For example:
        $Customer->update($data);
        return $Customer;
    }
}
