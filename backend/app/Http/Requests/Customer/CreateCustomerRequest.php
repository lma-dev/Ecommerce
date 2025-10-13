<?php

namespace App\Http\Requests\Customer;

use App\Enums\LocaleType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateCustomerRequest extends FormRequest
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
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:customers,email'],
            'password' => ['required', 'string', 'min:8'],
            'password_confirmation' => ['required', 'string', 'min:8', 'same:password'],
            "phone" => ['required', 'string', 'min:10', 'max:15'],
            'locale' => ['sometimes', 'string', Rule::in(array_map(fn (LocaleType $locale) => $locale->value, LocaleType::getAllLocales()))],
        ];
    }
}
