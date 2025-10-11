<?php

namespace App\Enums;

enum AppModeType: string
{
    case ADMIN_MODE = 'ADMIN';
    case CUSTOMER_MODE = 'CUSTOMER';

    public static function getAllStatuses(): array
    {
        return [
            self::ADMIN_MODE,
            self::CUSTOMER_MODE
        ];
    }
}
