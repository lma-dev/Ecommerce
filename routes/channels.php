<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Customer;
use App\Models\User as StaffUser;

$ordersChannel = config('order_broadcast.admin_channel');
$customerPrefixes = array_unique(array_filter(array_merge(
    [config('order_broadcast.customer_channel_prefix')],
    config('order_broadcast.additional_customer_channel_prefixes', [])
)));

$staffCanMonitorOrders = static function ($user): bool {
    if (! $user instanceof StaffUser) {
        return false;
    }

    return !method_exists($user, 'tokenCan') || $user->tokenCan('staff');
};

Broadcast::channel($ordersChannel, function ($user) use ($staffCanMonitorOrders) {
    // Admin/staff overview channel: only allow staff tokens with the "staff" ability
    return $staffCanMonitorOrders($user);
});

foreach ($customerPrefixes as $prefix) {
    Broadcast::channel($prefix . '{customerId}', function ($user, int $customerId) use ($staffCanMonitorOrders) {
        // Staff can monitor every customer stream
        if ($staffCanMonitorOrders($user)) {
            return true;
        }

        // Customers may access only their own private order stream
        return $user instanceof Customer
            && (int) $user->getKey() === $customerId;
    });
}
