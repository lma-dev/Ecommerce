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
            'description' => 'sometimes|string|max:1000',

            #Cloudinary image upload fields
            'image.public_id' => 'required|string',
            'image.url' => 'required|url',
            'image.format' => 'required|string|max:16',
            'image.width' => 'required|integer',
            'image.height' => 'required|integer',
            'image.bytes' => 'required|integer',
        ];
    }
}
