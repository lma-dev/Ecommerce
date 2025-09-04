<?php

namespace App\UseCases\Customer;

use App\Helpers\ResponseHelper;
use App\Http\Resources\Customer\CustomerResource;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;

class GetCustomerAction
{
    public function __invoke(array $data): JsonResponse
    {

        $data = $this->CustomerFilter($data);
        $meta = ResponseHelper::getPaginationMeta($data);

        return response()->json([
            'data' => CustomerResource::collection($data),
            'meta' => $meta,
        ]);
    }

    private function CustomerFilter(array $validatedData): LengthAwarePaginator
    {
        $query = Customer::query();
        $limit = $validatedData['limit'] ?? 8;
        $page = $validatedData['page'] ?? 1;
        $generalSearch = $validatedData['generalSearch'] ?? null;
        $role = $validatedData['role'] ?? null;
        $accountStatus = $validatedData['accountStatus'] ?? null;
        if (! empty($generalSearch)) {
            $query->where(function ($q) use ($generalSearch): void {
                $q->where('name', 'like', '%' . $generalSearch . '%')
                    ->orWhere('email', 'like', '%' . $generalSearch . '%');
            });
        }

        if (! empty($role)) {
            $query->where('role', '=', $role);
        }

        if (! empty($accountStatus)) {
            $query->where('account_status', '=', $accountStatus);
        }

        $data = $query->orderBy('created_at', 'desc')
            ->paginate($limit, ['*'], 'page', $page)
            ->withQueryString();

        return $data;
    }
}
