<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Order Broadcast Channels
    |--------------------------------------------------------------------------
    |
    | These values control the private channel names used when broadcasting
    | order-related events. Update the corresponding environment variables to
    | change channel naming without touching the codebase.
    |
    */

    'admin_channel' => env('ORDER_BROADCAST_ADMIN_CHANNEL', 'orders'),

    'customer_channel_prefix' => env('ORDER_BROADCAST_CUSTOMER_CHANNEL_PREFIX', 'orders.customer.'),

    'additional_customer_channel_prefixes' => array_filter(array_map('trim', explode(
        ',',
        env('ORDER_BROADCAST_ADDITIONAL_CUSTOMER_CHANNEL_PREFIXES', 'orders.')
    ))),
];
