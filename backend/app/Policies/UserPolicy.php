<?php

namespace App\Policies;

use App\Enums\UserRoleType;
use App\Models\User;

class UserPolicy
{
    // app/Policies/UserPolicy.php (short idea)
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [UserRoleType::ADMIN, UserRoleType::SUPER_ADMIN], true);
    }
    public function view(User $user): bool
    {
        return $user->role === UserRoleType::SUPER_ADMIN;
    }
    public function create(User $user): bool
    {
        return in_array($user->role, [UserRoleType::ADMIN, UserRoleType::SUPER_ADMIN], true);
    }
    public function update(User $user): bool
    {
        return $user->role === UserRoleType::SUPER_ADMIN;
    }
    public function delete(User $user): bool
    {
        return $user->role === UserRoleType::SUPER_ADMIN;
    }
}
