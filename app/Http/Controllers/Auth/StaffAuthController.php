<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StaffAuthController extends Controller
{
    /**
     * Staff/Admin/Superadmin login using Auth::attempt
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        // Try to login (using default 'web' guard)
        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Make sure it's a staff account (not customer)
        if (! $user instanceof \App\Models\User) {
            return response()->json(['message' => 'Forbidden: not a staff user'], 403);
        }

        // Assign Sanctum abilities
        $abilities = ['staff', $user->role];

        // Create a token
        $token = $user->createToken('staff-token', $abilities)->plainTextToken;

        return response()->json([
            'user'  => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
                'accountStatus' => $user->account_status,
            ],
            'token' => $token,
            'type'  => 'Bearer',
        ]);
    }

    /**
     * Logout (delete current token)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
