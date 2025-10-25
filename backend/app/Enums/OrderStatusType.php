<?php

namespace App\Enums;

enum OrderStatusType: string
{
    case DRAFT = 'DRAFT';
    case PENDING = 'PENDING';
    case COMPLETED = 'COMPLETED';
    case CANCELLED = 'CANCELLED';

    public static function getAllStatuses(): array
    {
        return [
            self::DRAFT,
            self::PENDING,
            self::COMPLETED,
            self::CANCELLED,
        ];
    }
}
