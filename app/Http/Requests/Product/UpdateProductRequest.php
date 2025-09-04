<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

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
            'name'        => 'sometimes|string|max:255|unique:products,name,' .  $this->product->id,
            'price'       => 'sometimes|numeric|min:0',
            'categoryId' => 'required|integer|exists:categories,id',
            'isActive'   => 'required|boolean',
            'image'       => 'sometimes|url',
            'description' => 'sometimes|string|max:1000',
        ];
    }
}
