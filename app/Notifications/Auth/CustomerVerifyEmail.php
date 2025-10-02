<?php

namespace App\Notifications\Auth;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\URL;

class CustomerVerifyEmail extends VerifyEmail implements ShouldQueue
{
    use Queueable;

    protected string $preferredLocale;

    public function __construct(?string $locale = null)
    {
        $this->preferredLocale = $locale ?? config('app.locale');

        $this->locale($this->preferredLocale);
    }

    protected function verificationUrl($notifiable)
    {
        return URL::temporarySignedRoute(
            'customer.verification.verify',
            Carbon::now()->addMinutes(config('auth.verification.expire', 60)),
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
                'locale' => $this->preferredLocale,
            ]
        );
    }

    protected function buildMailMessage($url)
    {
        return (new MailMessage)
            ->subject(Lang::get('Verify Email Address', [], $this->preferredLocale))
            ->line(Lang::get('Please click the button below to verify your email address.', [], $this->preferredLocale))
            ->action(Lang::get('Verify Email Address', [], $this->preferredLocale), $url)
            ->line(Lang::get('If you did not create an account, no further action is required.', [], $this->preferredLocale));
    }
}
