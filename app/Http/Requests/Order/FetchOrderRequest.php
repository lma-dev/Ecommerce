<?php

namespace App\Http\Requests\Order;

use App\Enums\OrderStatusType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FetchOrderRequest extends FormRequest
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
            'limit' => ['nullable', 'integer'],
            'page' => ['nullable', 'integer'],
            'status' => ['nullable', 'string', Rule::in(OrderStatusType::getAllStatuses())],
            'customerId' => ['nullable', 'integer'],
        ];
    }
}
