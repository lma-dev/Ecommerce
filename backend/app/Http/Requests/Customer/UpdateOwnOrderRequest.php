<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Enums\OrderStatusType;

class UpdateOwnOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>|string>
     */
    public function rules(): array
    {
        return [
            'notes'           => ['nullable', 'string', 'max:1000'],
            'shippingAddress' => ['nullable', 'string', 'max:2000'],
            'productIds'      => ['sometimes', 'array', 'min:1'],
            'productIds.*'    => ['integer', 'exists:products,id'],
            'status'          => ['sometimes', 'string', Rule::in(OrderStatusType::getAllStatuses())],
        ];
    }
}
