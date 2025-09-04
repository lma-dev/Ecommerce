<?php

namespace App\Helpers;

use Illuminate\Pagination\LengthAwarePaginator;

class ResponseHelper
{
    public static function success(string $message, mixed $data = null, int $status = 200): \Illuminate\Http\JsonResponse
    {

        return response()->json(
            [
                'result' => 1,
                'message' => $message,
                'data' => $data,
            ],
            $status
        );
    }

    public static function fail(string $message, mixed $data, int $status = 500): \Illuminate\Http\JsonResponse
    {
        return response()->json(
            [
                'result' => 0,
                'message' => $message,
                'data' => $data,
            ],
            $status
        );
    }

    /**
     * @return array<string, int|null>
     */
    public static function getPaginationMeta(LengthAwarePaginator $data): array
    {
        return [
            'currentPage' => $data->currentPage(),
            'totalPages' => $data->lastPage(),
            'startOffset' => $data->firstItem(),
            'endOffset' => $data->lastItem(),
            'totalItems' => $data->total(),
        ];
    }
}
