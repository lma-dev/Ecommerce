<?php

namespace App\Http\Controllers\Api\V1\Customer;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\UpdateOwnProfileRequest;
use App\Http\Resources\Customer\CustomerResource;
use App\Models\Customer;
use App\UseCases\Customer\UpdateCustomerAction;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    /** GET /customer/me */
    public function show()
    {
        /** @var Customer $customer */
        $customer = Auth::guard('sanctum')->user();
        return ResponseHelper::success('Success', new CustomerResource($customer));
    }

    /** PUT/PATCH /customer/me */
    public function update(UpdateOwnProfileRequest $request)
    {
        /** @var Customer $customer */
        $customer = Auth::guard('sanctum')->user();
        $validated = $request->validated();
        $updated = (new UpdateCustomerAction())($customer, $validated);
        return ResponseHelper::success('Profile updated successfully', new CustomerResource($updated));
    }

    /** DELETE /customer/me */
    public function destroy()
    {
        /** @var Customer $customer */
        $customer = Auth::guard('sanctum')->user();
        $customer->delete();
        return ResponseHelper::success('Account deleted successfully');
    }
}

