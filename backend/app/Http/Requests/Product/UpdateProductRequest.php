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
            'categoryId'  => 'sometimes|integer|exists:categories,id',
            'isActive'    => ['sometimes', 'string', Rule::in(VisibilityStatusType::getAllStatuses())],
            'description' => 'sometimes|string|max:1000',

            #Cloudinary image upload fields
            'image.public_id'     => ['sometimes', 'required', 'string', 'max:255'],
            'image.url'           => ['sometimes', 'required', 'url', 'max:2048', 'regex:/^https:\/\/res\.cloudinary\.com\//i'],
            'image.format'        => ['sometimes', 'nullable', 'string', 'max:16'],
            'image.width'         => ['sometimes', 'nullable', 'integer', 'min:1'],
            'image.height'        => ['sometimes', 'nullable', 'integer', 'min:1'],
            'image.bytes'         => ['sometimes', 'nullable', 'integer', 'min:1'],
        ];
    }
}
