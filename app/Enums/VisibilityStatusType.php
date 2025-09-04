<?php

namespace App\Enums;

enum VisibilityStatusType: string
{
    case ACTIVE = 'ACTIVE';
    case INACTIVE = 'INACTIVE';


    public static function getAllStatuses(): array
    {
        return [
            self::ACTIVE,
            self::INACTIVE,
        ];
    }
}
