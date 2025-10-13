<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        // Must be a User
        if (! $user instanceof \App\Models\User) {
            abort(403, 'Forbidden: not a staff user.');
        }

        // Check allowed roles (plain string comparison)
        if (! in_array($user->role, $roles, true)) {
            abort(403, 'Forbidden: insufficient role.');
        }

        return $next($request);
    }
}
