<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;

class StoreOwnOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // customerId & status are set server-side
            'notes'           => ['nullable', 'string', 'max:1000'],
            'shippingAddress' => ['sometimes', 'string', 'max:2000'],
            'productIds'      => ['required', 'array', 'min:1'],
            'productIds.*'    => ['integer', 'exists:products,id'],
        ];
    }
}

