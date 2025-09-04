<?php

namespace App\UseCases\Order;

use App\Helpers\ResponseHelper;
use App\Http\Resources\Order\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;

class GetOrderAction
{
    public function __invoke(array $data): JsonResponse
    {

        $data = $this->OrderFilter($data);
        $meta = ResponseHelper::getPaginationMeta($data);

        return response()->json([
            'data' => OrderResource::collection($data),
            'meta' => $meta,
        ]);
    }

    private function OrderFilter(array $validatedData): LengthAwarePaginator
    {
        $limit      = (int) ($validatedData['limit'] ?? 8);
        $page       = (int) ($validatedData['page'] ?? 1);
        $status     = $validatedData['status'] ?? null;
        $customerId = $validatedData['customerId'] ?? null;

        $data = Order::query()
            ->with(['customer', 'products'])
            ->whereNull('deleted_at')
            ->when($status, fn($q, $r) => $q->where('status', $r))
            ->when($customerId, fn($q, $st) => $q->where('customer_id', $st))
            ->latest('created_at')
            ->paginate($limit, ['*'], 'page', $page)
            ->withQueryString();

        return $data;
    }
}
