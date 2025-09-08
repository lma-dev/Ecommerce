<?php

namespace App\UseCases\Customer;

use App\Models\Customer;

class DetailCustomerAction
{
    public function __invoke(Customer $customer): Customer
    {
        return $customer;
    }
}
