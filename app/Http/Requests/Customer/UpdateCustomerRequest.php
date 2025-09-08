<?php

namespace App\Http\Requests\Customer;

use App\Enums\AccountStatusType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'                  => ['sometimes', 'string', 'max:255'],
            'email'                 => ['sometimes', 'email', 'max:255', 'unique:customers,email,' . $this->customer->id],
            'password'              => ['sometimes', 'string', 'min:8'],
            'password_confirmation' => ['sometimes', 'string', 'min:8', 'same:password'],
            'phone'                 => ['sometimes', 'string', 'min:10', 'max:15'],
            'accountStatus'         => ['sometimes', 'string', Rule::in(AccountStatusType::getAllStatuses())],
        ];
    }
}

