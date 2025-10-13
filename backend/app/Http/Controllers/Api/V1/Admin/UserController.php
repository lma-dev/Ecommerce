<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Helpers\ResponseHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\User\FetchUserRequest;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\User\UserResource;
use App\UseCases\User\DeleteUserAction;
use App\UseCases\User\DetailUserAction;
use App\UseCases\User\GetUserAction;
use App\UseCases\User\StoreUserAction;
use App\UseCases\User\UpdateUserAction;
use App\Models\User;

class UserController extends Controller
{
    /** GET /staff/users */
    public function index(FetchUserRequest $request)
    {
        $validated = $request->safe()->all();
        $data = (new GetUserAction())($validated);
        return $data;
    }

    /** GET /staff/users/{user} */
    public function show(User $user)
    {
        $data = (new DetailUserAction())($user);
        return ResponseHelper::success(
            "Success",
            new UserResource($data)
        );
    }

    /** POST /staff/users */
    public function store(StoreUserRequest $request)
    {
        $validated = $request->safe()->all();
        $user = (new StoreUserAction())($validated);

        return ResponseHelper::success(
            "User created successfully",
            new UserResource($user),
            201
        );
    }

    /** PUT/PATCH /staff/users/{user} */
    public function update(UpdateUserRequest $request, User $user)
    {
        $validated = $request->safe()->all();
        $data = (new UpdateUserAction())($user, $validated);

        return ResponseHelper::success(
            "User updated successfully",
            new UserResource($data)
        );
    }

    /** DELETE /staff/users/{user} */
    public function destroy(User $user)
    {
        $data = (new DeleteUserAction())($user);

        return ResponseHelper::success(
            "User deleted successfully",
            null
        );
    }
}
