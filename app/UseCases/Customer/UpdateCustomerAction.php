<?php

namespace App\UseCases\Customer;

use App\Models\Customer;
use Illuminate\Support\Facades\Hash;

class UpdateCustomerAction
{
    public function __invoke(Customer $Customer, array $data): Customer
    {
        $payload = [];

        if (array_key_exists('name', $data)) {
            $payload['name'] = $data['name'];
        }
        if (array_key_exists('email', $data)) {
            $payload['email'] = $data['email'];
        }
        if (array_key_exists('phone', $data)) {
            $payload['phone'] = $data['phone'];
        }
        if (array_key_exists('accountStatus', $data)) {
            $payload['account_status'] = $data['accountStatus'];
        }
        if (array_key_exists('password', $data)) {
            $payload['password'] = Hash::make($data['password']);
        }

        if (! empty($payload)) {
            $Customer->update($payload);
        }
        return $Customer;
    }
}
