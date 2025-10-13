<?php

namespace App\UseCases\Dashboard;

use App\Enums\AccountStatusType;
use App\Enums\OrderStatusType;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

class GetDashboardAction
{
    /**
     * @param array<string, mixed> $data
     * @return array<string, int>
     */
    public function __invoke(array $data = []): array
    {
        // Efficient aggregate queries (no N+1 risk)
        $pendingOrdersCount = Order::query()
            ->whereNull('deleted_at')
            ->where('status', OrderStatusType::PENDING->value)
            ->count();

        $completedOrdersTotalAmount = (int) Order::query()
            ->whereNull('deleted_at')
            ->where('status', OrderStatusType::COMPLETED->value)
            ->sum('total_amount');

        $customersCount = Customer::query()->where('account_status', AccountStatusType::ACTIVE)->count();
        $usersCount     = User::query()->where('account_status', AccountStatusType::ACTIVE)->count();
        $productsCount  = Product::query()->whereNull('deleted_at')->count();

        return [
            'pendingOrdersCount' => $pendingOrdersCount,
            'completedOrdersTotalAmount' => $completedOrdersTotalAmount,
            'customersCount'     => $customersCount,
            'usersCount'         => $usersCount,
            'productsCount'      => $productsCount,
        ];
    }
}
