<?php

namespace App\Http\Requests\Category;

use App\Enums\VisibilityStatusType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
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
            'name'        => 'required|string|max:255|unique:categories,name',
            'description' => 'sometimes|string|max:1000',
            'isActive'    => ['sometimes', 'string', Rule::in(VisibilityStatusType::getAllStatuses())],
        ];
    }
}
