<?php

namespace App\Http\Resources\Dashboard;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, int>
     */
    public function toArray(Request $request): array
    {
        return [
            'pendingOrdersCount' => (int) ($this['pendingOrdersCount'] ?? 0),
            'completedOrdersTotalAmount' => (int) ($this['completedOrdersTotalAmount'] ?? 0),
            'customersCount'     => (int) ($this['customersCount'] ?? 0),
            'usersCount'         => (int) ($this['usersCount'] ?? 0),
            'productsCount'      => (int) ($this['productsCount'] ?? 0),
        ];
    }
}
