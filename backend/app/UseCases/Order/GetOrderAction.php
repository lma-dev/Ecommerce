<?php

namespace App\UseCases\Order;

use App\Helpers\ResponseHelper;
use App\Http\Resources\Order\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;

class GetOrderAction
{
    /**
     * Fetch orders depending on role context.
     *
     * @param  array<string, mixed>  $data
     * @param  int|null  $scopedCustomerId
     */
    public function __invoke(array $data, ?int $scopedCustomerId = null): JsonResponse
    {
        $orders = $this->filterOrders($data, $scopedCustomerId);
        $meta = ResponseHelper::getPaginationMeta($orders);

        return response()->json([
            'data' => OrderResource::collection($orders),
            'meta' => $meta,
        ]);
    }

    /**
     * Filter logic: admin sees all orders, customer sees only non-draft.
     */
    private function filterOrders(array $validatedData, ?int $scopedCustomerId = null): LengthAwarePaginator
    {
        $limit      = (int) ($validatedData['limit'] ?? 8);
        $page       = (int) ($validatedData['page'] ?? 1);
        $status     = $validatedData['status'] ?? null;

        $query = Order::query()
            ->with(['customer', 'products'])
            ->whereNull('deleted_at')
            ->latest('created_at');

        //  For customers
        if ($scopedCustomerId) {
            $query->where('customer_id', $scopedCustomerId)
                ->where('status', '!=', 'DRAFT'); // exclude draft orders
        }

        //  For admin (no customer_id filter)
        if ($status) {
            $query->where('status', $status);
        }

        return $query->paginate($limit, ['*'], 'page', $page)->withQueryString();
    }
}
