<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\CreateCustomerRequest;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class CustomerAuthController extends Controller
{
    /**
     * Register a new customer
     */
    public function register(CreateCustomerRequest $request)
    {
        $data = $request->safe->all();

        $customer = Customer::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'phone'    => $data['phone'],
        ]);

        return response()->json([
            'message'  => 'Customer registered successfully',
            'customer' => [
                'id'    => $customer->id,
                'name'  => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
            ],
        ], 201);
    }

    /**
     * Customer login
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $customer = Customer::where('email', $credentials['email'])->first();

        if (! $customer || ! Hash::check($credentials['password'], $customer->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Customers don’t have roles, but you can assign abilities
        $token = $customer->createToken('customer-token', [
            'customer',
            'orders.read-own',
        ])->plainTextToken;

        return response()->json([
            'customer' => [
                'id'    => $customer->id,
                'name'  => $customer->name,
                'email' => $customer->email,
            ],
            'token' => $token,
            'type'  => 'Bearer',
        ]);
    }

    /**
     * Logout (delete current token)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
