<?php

namespace App\Enums;

enum AccountStatusType: string
{
    case ACTIVE = 'ACTIVE';
    case SUSPENDED = 'SUSPENDED';

    public static function getAllStatuses(): array
    {
        return [
            self::ACTIVE,
            self::SUSPENDED
        ];
    }
}
