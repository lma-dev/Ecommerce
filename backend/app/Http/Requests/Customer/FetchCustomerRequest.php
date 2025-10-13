<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;

class FetchCustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'limit'         => ['sometimes', 'integer', 'min:1', 'max:100'],
            'page'          => ['sometimes', 'integer', 'min:1'],
            'generalSearch' => ['sometimes', 'string', 'max:255'],
            'accountStatus' => ['sometimes', 'string', 'max:50'],
        ];
    }
}
