<?php

namespace App\Http\Requests\Product;

use App\Enums\VisibilityStatusType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
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
            'name' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('products', 'name')->ignore($this->route('product')?->id),
            ],
            'price'       => 'sometimes|numeric|min:0',
            // Allow partial updates without forcing categoryId each time
            'categoryId'  => 'sometimes|integer|exists:categories,id',
            'isActive'    => ['sometimes', 'string', Rule::in(VisibilityStatusType::getAllStatuses())],
            'image'       => ['nullable', 'file', 'image', 'max:2048'],
            'description' => 'sometimes|string|max:1000',
        ];
    }
}
