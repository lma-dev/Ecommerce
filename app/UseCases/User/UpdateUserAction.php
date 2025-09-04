<?php

namespace App\UseCases\User;

use App\Models\User;

class UpdateUserAction
{
    public function __invoke(User $user, array $data): User
    {
        // Business logic to create a new user
        // For example:
        $user->update([
            'name' => $data['name'] ?? $user->name,
            'email' => $data['email'] ?? $user->email,
            'password' => $data['password'] ?? $user->password,
            'role' => $data['role'] ?? $user->role,
            'account_status' => $data['accountStatus'] ?? $user->account_status,
        ]);
        return $user;
    }
}
