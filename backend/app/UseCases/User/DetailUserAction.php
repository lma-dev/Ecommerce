<?php

namespace App\UseCases\User;

use App\Models\User;

class DetailUserAction
{
    public function __invoke(User $user)
    {
        return $user;
    }
}
