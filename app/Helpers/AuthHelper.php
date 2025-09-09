<?php

use App\Models\Customer;
use App\Models\User;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Auth;

if (!function_exists('getAuthUserOrFail')) {
    function getAuthUserOrFail(): User
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user || !($user instanceof User)) {
            throw new AuthenticationException('Invalid user');
        }
        return $user;
    }
}

// Internal helper to fetch the authenticated customer via Sanctum
if (!function_exists('_resolveAuthenticatedCustomer')) {
    function _resolveAuthenticatedCustomer(): Customer
    {
        $customer = Auth::guard('sanctum')->user();
        if (!$customer || !($customer instanceof Customer)) {
            throw new AuthenticationException('Invalid customer');
        }
        return $customer;
    }
}

// Keep both function names for compatibility
if (!function_exists('getAuthCustomerOrFail')) {
    function getAuthCustomerOrFail(): Customer
    {
        return _resolveAuthenticatedCustomer();
    }
}

if (!function_exists('getAuthCustomerOrFailed')) {
    function getAuthCustomerOrFailed(): Customer
    {
        return _resolveAuthenticatedCustomer();
    }
}
