<?php

namespace App\UseCases\Customer;

use App\Models\Customer;

class DeleteCustomerAction
{
    public function __invoke(Customer $customer): Customer
    {
        // Business logic to delete a Customer by ID
        // For example:
        $customer->delete();
        return $customer;
    }
}
