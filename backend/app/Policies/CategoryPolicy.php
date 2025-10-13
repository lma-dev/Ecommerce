<?php

namespace App\Policies;

use App\Enums\AccountStatusType;
use App\Enums\UserRoleType;
use App\Models\Category;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CategoryPolicy
{
    use HandlesAuthorization;

    /**
     * Grant all abilities to active super admins.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->account_status === AccountStatusType::ACTIVE->value
            && $user->role === UserRoleType::SUPER_ADMIN->value) {
            return true;
        }

        return null;
    }

    public function create(User $user): bool
    {
        return $this->canManage($user);
    }

    public function update(User $user, Category $category): bool
    {
        return $this->canManage($user);
    }

    public function delete(User $user, Category $category): bool
    {
        return $this->canManage($user);
    }

    private function canManage(User $user): bool
    {
        if ($user->account_status !== AccountStatusType::ACTIVE->value) {
            return false;
        }

        return in_array(
            $user->role,
            [
                UserRoleType::ADMIN->value,
                UserRoleType::STAFF->value,
            ],
            true
        );
    }
}
