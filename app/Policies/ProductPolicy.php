<?php

namespace App\Policies;

use App\Enums\AccountStatusType;
use App\Enums\UserRoleType;
use App\Models\Product;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProductPolicy
{
    use HandlesAuthorization;

    /**
     * Active super admins bypass the remaining checks.
     */
    public function before(User $user, string $ability): bool|null
    {
        if (
            $user->account_status === AccountStatusType::ACTIVE->value
            && $user->role === UserRoleType::SUPER_ADMIN->value
        ) {
            return true;
        }

        return null;
    }

    public function create(User $user): bool
    {
        return $this->canManage($user);
    }

    public function update(User $user, Product $product): bool
    {
        return $this->canManage($user);
    }

    public function delete(User $user, Product $product): bool
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
