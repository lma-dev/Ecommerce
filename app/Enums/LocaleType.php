<?php

namespace App\Enums;

enum LocaleType: string
{
    case EN = 'en';
    case MM = 'mm';
    case JP = 'jp';

    public static function getAllLocales(): array
    {
        return [
            self::EN,
            self::MM,
            self::JP
        ];
    }
}
