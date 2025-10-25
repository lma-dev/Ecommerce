<?php

namespace App\Http\Requests\Customer;

use App\Enums\OrderStatusType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOwnOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // customerId is set server-side
            'notes'           => ['nullable', 'string', 'max:1000'],
            'shippingAddress' => ['sometimes', 'string', 'max:2000'],
            'productIds'      => ['required', 'array', 'min:1'],
            'productIds.*'    => ['integer', 'exists:products,id'],
            'status'          => ['sometimes', 'string', Rule::in(OrderStatusType::getAllStatuses())],
        ];
    }
}
