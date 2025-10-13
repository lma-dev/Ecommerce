<?php

namespace App\Http\Controllers\Auth;

use App\Enums\AccountStatusType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\CreateCustomerRequest;
use App\Models\Customer;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class CustomerAuthController extends Controller
{
    /**
     * Register a new customer
     */
    public function register(CreateCustomerRequest $request): JsonResponse
    {
        $data = $request->validated();

        $customer = Customer::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'phone'    => $data['phone'],
            'account_status' => AccountStatusType::ACTIVE->value,

        ]);

        event(new Registered($customer));

        $customer->sendEmailVerificationNotification();

        return response()->json([
            'message'  => 'Customer registered successfully. Please verify your email address.',
            'customer' => [
                'id'    => $customer->id,
                'name'  => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
            ],
            'requires_email_verification' => true,
        ], 201);
    }

    /**
     * Customer login
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $customer = Customer::where('email', $credentials['email'])->first();

        if (! $customer || ! Hash::check($credentials['password'], $customer->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if (! $customer->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email address is not verified.',
            ], 403);
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
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
