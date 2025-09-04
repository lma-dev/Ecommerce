<?php

use App\Models\Customer;
use App\Models\User;
use Illuminate\Auth\AuthenticationException;

if (!function_exists('getAuthUserOrFail')) {
    function getAuthUserOrFail(): User
    {
        $user = auth('api')->user();
        if (!$user || !($user instanceof User)) {
            throw new AuthenticationException('Invalid user');
        }
        return $user;
    }
}

if (!function_exists('getAuthCustomerOrFail')) {
    function getAuthCustomerOrFail(): Customer
    {
        $customer = auth('api_customer')->user();
        if (!$customer || !($customer instanceof Customer)) {
            throw new \Exception('Invalid customer');
        }
        return $customer;
    }
}
