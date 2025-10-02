<?php

namespace App\Providers;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void {}

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            $locale = request()?->input('locale') ?? config('app.locale');
            $baseUrl = rtrim(config('app.frontend_url'), '/');

            $queryParams = [];

            if ($notifiable instanceof User) {
                $queryParams['type'] = 'console';
            }

            $queryParams['email'] = $notifiable->getEmailForPasswordReset();

            $query = http_build_query($queryParams);

            return sprintf(
                '%s/%s/password-reset/%s?%s',
                $baseUrl,
                $locale,
                $token,
                $query
            );
        });

        VerifyEmail::createUrlUsing(function (object $notifiable) {
            $locale = request()?->input('locale') ?? request()?->query('locale') ?? config('app.locale');
            $expires = now()->addMinutes(config('auth.verification.expire', 60));

            if ($notifiable instanceof Customer) {
                return URL::temporarySignedRoute(
                    'customer.verification.verify',
                    $expires,
                    [
                        'id' => $notifiable->getKey(),
                        'hash' => sha1($notifiable->getEmailForVerification()),
                        'locale' => $locale,
                    ]
                );
            }

            return URL::temporarySignedRoute(
                'verification.verify',
                $expires,
                [
                    'id' => $notifiable->getKey(),
                    'hash' => sha1($notifiable->getEmailForVerification()),
                ]
            );
        });
    }
}
