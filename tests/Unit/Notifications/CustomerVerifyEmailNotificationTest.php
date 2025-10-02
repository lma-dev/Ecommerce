<?php

namespace Tests\Unit\Notifications;

use App\Models\Customer;
use App\Notifications\Auth\CustomerVerifyEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class CustomerVerifyEmailNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_verify_email_notification_is_queued_and_contains_locale(): void
    {
        $customer = Customer::factory()->create([
            'email_verified_at' => null,
        ]);

        $notification = new CustomerVerifyEmail('jp');

        $this->assertInstanceOf(ShouldQueue::class, $notification);

        $mail = $notification->toMail($customer);

        $this->assertTrue(Str::contains($mail->actionUrl, '/api/customer/email/verify/' . $customer->id));
        $this->assertTrue(Str::contains($mail->actionUrl, 'locale=jp'));
    }
}
