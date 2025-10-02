<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class CustomerPasswordResetLinkController extends Controller
{
    public function store(ForgotPasswordRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $checkEmailExistsOrNot = Customer::where('email', $validated['email'])->first();
        if (!$checkEmailExistsOrNot) {
            throw ValidationException::withMessages([
                'email' => ['Email does not exist in our records.'],
            ]);
        }
        $status = Password::broker('customers')->sendResetLink(
            $request->only('email')
        );

        if ($status != Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return response()->json(['status' => __($status)]);
    }
}
