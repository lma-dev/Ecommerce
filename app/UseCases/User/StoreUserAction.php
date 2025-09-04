<?php

namespace App\UseCases\User;

use App\Models\User;

class StoreUserAction
{
    public function __invoke(array $data): User
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'] ?? 'USER',
            'account_status' => $data['accountStatus'] ?? 'ACTIVE',
        ]);
    }
}
