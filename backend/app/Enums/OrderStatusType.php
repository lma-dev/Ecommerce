<?php

namespace App\Enums;

enum OrderStatusType: string
{
    case PENDING = 'PENDING';
    case COMPLETED = 'COMPLETED';
    case CANCELLED = 'CANCELLED';

    public static function getAllStatuses(): array
    {
        return [
            self::PENDING,
            self::COMPLETED,
            self::CANCELLED,
        ];
    }
}
