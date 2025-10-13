<?php

namespace App\Notifications\Auth;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class AdminResetPassword extends ResetPassword implements ShouldQueue
{
    use Queueable;

    protected string $preferredLocale;

    public function __construct(string $token, ?string $locale = null)
    {
        parent::__construct($token);

        $this->preferredLocale = $locale ?? config('app.locale');

        $this->locale($this->preferredLocale);
    }

    protected function effectiveLocale(): string
    {
        return $this->preferredLocale;
    }

    protected function resetUrl($notifiable)
    {
        $locale = $this->effectiveLocale();

        return sprintf(
            '%s/%s/password-reset/%s?type=console&email=%s',
            rtrim(config('app.frontend_url'), '/'),
            $locale,
            $this->token,
            urlencode($notifiable->getEmailForPasswordReset())
        );
    }

    protected function buildMailMessage($url)
    {
        $expiration = config('auth.passwords.users.expire', config('auth.passwords.' . config('auth.defaults.passwords') . '.expire'));

        return (new MailMessage)
            ->subject(__('Admin Password Reset'))
            ->line(__('An administrator requested to reset the password for this account.'))
            ->action(__('Reset Password'), $url)
            ->line(__('This password reset link will expire in :count minutes.', ['count' => $expiration]))
            ->line(__('If you did not request a password reset, please contact support immediately.'));
    }
}
