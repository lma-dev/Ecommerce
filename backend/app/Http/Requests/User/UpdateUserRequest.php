<?php

namespace App\Http\Requests\User;

use App\Enums\AccountStatusType;
use App\Enums\UserRoleType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
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
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $this->user->id],
            'password' => ['sometimes', 'string', 'min:8'],
            'role' => ['sometimes', 'string', Rule::in(UserRoleType::getAllRoles())],
            'accountStatus' => ['sometimes', 'string', Rule::in(AccountStatusType::getAllStatuses())],
        ];
    }
}
