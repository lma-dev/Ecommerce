<?php

namespace Tests\Unit\Notifications;

use App\Models\Customer;
use App\Notifications\Auth\CustomerResetPassword;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CustomerResetPasswordNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_reset_password_notification_is_queued_and_uses_shared_path(): void
    {
        $customer = Customer::factory()->create([
            'email_verified_at' => now(),
        ]);

        $notification = new CustomerResetPassword('token-123', 'mm');

        $this->assertInstanceOf(ShouldQueue::class, $notification);

        $mail = $notification->toMail($customer);

        $this->assertStringContainsString('/mm/password-reset/token-123', $mail->actionUrl);
        $this->assertStringContainsString('email=' . urlencode($customer->email), $mail->actionUrl);
    }
}
