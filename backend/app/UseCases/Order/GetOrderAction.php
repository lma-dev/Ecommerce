<?php

namespace App\UseCases\Order;

use App\Helpers\ResponseHelper;
use App\Http\Resources\Order\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;

class GetOrderAction
{
    public function __invoke(array $data, ?int $scopedCustomerId = null): JsonResponse
    {

        $data = $this->OrderFilter($data, $scopedCustomerId);
        $meta = ResponseHelper::getPaginationMeta($data);

        return response()->json([
            'data' => OrderResource::collection($data),
            'meta' => $meta,
        ]);
    }

    private function OrderFilter(array $validatedData, ?int $scopedCustomerId = null): LengthAwarePaginator
    {
        $limit      = (int) ($validatedData['limit'] ?? 8);
        $page       = (int) ($validatedData['page'] ?? 1);
        $status     = $validatedData['status'] ?? null;
        // If a scoped ID is provided (e.g., customer context), it overrides input
        $customerId = $scopedCustomerId ?? ($validatedData['customerId'] ?? null);

        $data = Order::query()
            ->with(['customer', 'products'])
            ->whereNull('deleted_at')
            ->when($status, fn($q, $r) => $q->where('status', $r))
            ->when($customerId, fn($q, $st) => $q->where('customer_id', (int) $st))
            ->latest('created_at')
            ->paginate($limit, ['*'], 'page', $page)
            ->withQueryString();

        return $data;
    }
}
