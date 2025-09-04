<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;

class FetchCategoryRequest extends FormRequest
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
            'name' => ['nullable', 'string'],
            "isActive" => ['nullable', 'string'],
        ];
    }
}
