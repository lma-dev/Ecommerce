<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customerId'  => 'sometimes|integer|exists:customers,id',
            'status'       => 'sometimes|string|max:50',
            'notes'        => 'nullable|string|max:1000',
            'shippingAddress' => 'nullable|string|max:2000',
            'productIds'  => 'sometimes|array|min:1',
            'productIds.*' => 'integer|exists:products,id',
        ];
    }
}
