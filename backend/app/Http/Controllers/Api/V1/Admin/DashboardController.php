<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Dashboard\FetchDashboardRequest;
use App\Http\Resources\Dashboard\DashboardResource;
use App\UseCases\Dashboard\GetDashboardAction;

class DashboardController extends Controller
{
    /** GET /staff/dashboard */
    public function index(FetchDashboardRequest $request)
    {
        $validated = $request->safe()->all();
        $data = (new GetDashboardAction())($validated);

        return ResponseHelper::success(
            'Dashboard fetched successfully',
            new DashboardResource($data)
        );
    }
}

