<?php

namespace App\UseCases\Customer;

use App\Models\Customer;

class DeleteCustomerAction
{
    public function __invoke(Customer $Customer): Customer
    {
        // Business logic to delete a Customer by ID
        // For example:
        $Customer->delete();
        return $Customer;
    }
}
