<?php

namespace App\UseCases\Customer;

use App\Models\Customer;
use Illuminate\Support\Facades\Hash;

class StoreCustomerAction
{
    public function __invoke(array $data): Customer
    {
        return Customer::create([
            'name'            => $data['name'],
            'email'           => $data['email'],
            'password'        => Hash::make($data['password']),
            'phone'           => $data['phone'],
            'account_status'  => $data['accountStatus'] ?? 'ACTIVE',
        ]);
    }
}
