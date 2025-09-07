<?php

namespace App\Http\Requests\Product;

use App\Enums\VisibilityStatusType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
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
            'name'        => 'required|string|max:255|unique:products,name',
            'price'       => 'required|numeric|min:0',
            'categoryId' => 'required|integer|exists:categories,id',
            'isActive'    => ['sometimes', 'string', Rule::in(VisibilityStatusType::getAllStatuses())],
            'image'       => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'sometimes|string|max:1000',
        ];
    }
}
