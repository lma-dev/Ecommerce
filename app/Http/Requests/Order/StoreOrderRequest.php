<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
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
            'customerId'  => 'required|integer|exists:customers,id',
            'status'       => 'required|string|max:50',
            'notes'        => 'sometimes|string|max:1000',
            'shippingAddress' => 'sometimes|string|max:2000',
            'productIds'  => 'required|array|min:1',
            'productIds.*' => 'integer|exists:products,id',
        ];
    }
}
