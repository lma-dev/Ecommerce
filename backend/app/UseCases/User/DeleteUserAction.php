<?php

namespace App\UseCases\User;

use App\Models\User;

class DeleteUserAction
{
    public function __invoke(User $user): User
    {
        // Business logic to delete a user by ID
        // For example:
        $user->delete();
        return $user;
    }
}
