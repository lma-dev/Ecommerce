<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withProviders([
        App\Providers\BroadcastServiceProvider::class,
    ])
    ->withMiddleware(function (Middleware $middleware): void {
        // For the "api" group
        $middleware->api(prepend: [
            EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->api(append: [
            SubstituteBindings::class,
        ]);
        $middleware->web(append: [
            SubstituteBindings::class,
        ]);

        // Aliases (so you can use them by short name in routes)
        $middleware->alias([
            'verified'   => \App\Http\Middleware\EnsureEmailIsVerified::class,
            'tokenable'  => \App\Http\Middleware\EnsureTokenable::class,
            'role'       => \App\Http\Middleware\EnsureRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })
    ->create();
