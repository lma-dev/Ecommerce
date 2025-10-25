<?php

use Illuminate\Support\Str;


if (!function_exists('uuidGenerator')) {
    function uuidGenerator(): string
    {
        return (string) 'ORD-' . now()->format('ymd') . '-' . strtoupper(Str::random(4));
    }
}
