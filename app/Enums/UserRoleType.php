<?php

namespace App\Enums;

enum UserRoleType: string
{
    case SUPER_ADMIN = 'SUPER_ADMIN';
    case ADMIN = 'ADMIN';
    case STAFF = 'STAFF';

    public static function getAllRoles(): array
    {
        return [
            self::SUPER_ADMIN,
            self::ADMIN,
            self::STAFF,
        ];
    }
}
