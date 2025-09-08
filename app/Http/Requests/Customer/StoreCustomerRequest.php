<?php

namespace App\Http\Requests\Customer;

use App\Enums\AccountStatusType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'                  => ['required', 'string', 'max:255'],
            'email'                 => ['required', 'email', 'max:255', 'unique:customers,email'],
            'password'              => ['required', 'string', 'min:8'],
            // 'password_confirmation' => ['required', 'string', 'min:8', 'same:password'],
            'phone'                 => ['required', 'string', 'min:10', 'max:15'],
            'accountStatus'         => ['sometimes', 'string', Rule::in(AccountStatusType::getAllStatuses())],
        ];
    }
}
