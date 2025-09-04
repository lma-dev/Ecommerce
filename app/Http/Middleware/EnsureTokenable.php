<?php

namespace App\Http\Middleware;

use App\Models\Customer;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTokenable
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $type)
    {
        $actor = $request->user(); // resolved by sanctum

        $expected = $type === 'user'
            ? User::class
            : Customer::class;

        if (! $actor instanceof $expected) {
            abort(403, 'Forbidden: wrong account type.');
        }

        return $next($request);
    }
}
