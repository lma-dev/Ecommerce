<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOwnProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $customerId = $this->user()?->id;
        return [
            'name'                  => ['sometimes', 'string', 'max:255'],
            'email'                 => ['sometimes', 'email', 'max:255', Rule::unique('customers', 'email')->ignore($customerId)],
            'password'              => ['sometimes', 'string', 'min:8'],
            'password_confirmation' => ['sometimes', 'string', 'min:8', 'same:password'],
            'phone'                 => ['sometimes', 'string', 'min:10', 'max:15'],
            // no accountStatus change from customer self-service
        ];
    }
}

