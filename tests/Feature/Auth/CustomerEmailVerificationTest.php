<?php

namespace Tests\Feature\Auth;

use App\Models\Customer;
use App\Notifications\Auth\CustomerVerifyEmail;
use Illuminate\Auth\Events\Verified;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class CustomerEmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_verify_email_via_signed_url(): void
    {
        $customer = Customer::factory()->create([
            'email_verified_at' => null,
        ]);

        Event::fake();

        $verificationUrl = URL::temporarySignedRoute(
            'customer.verification.verify',
            now()->addMinutes(60),
            [
                'id' => $customer->id,
                'hash' => sha1($customer->getEmailForVerification()),
                'locale' => 'en',
            ]
        );

        $response = $this->get($verificationUrl);

        Event::assertDispatched(Verified::class, fn (Verified $event) => $event->user->is($customer));
        $this->assertTrue($customer->fresh()->hasVerifiedEmail());

        $response->assertRedirect(
            sprintf('%s/%s/login?verification=verified', rtrim(config('app.frontend_url'), '/'), 'en')
        );
    }

    public function test_customer_can_request_verification_email_resend(): void
    {
        Notification::fake();

        $customer = Customer::factory()->create([
            'email_verified_at' => null,
        ]);

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson('/api/customer/email/resend', ['locale' => 'jp']);

        $response->assertOk()
            ->assertJson([
                'status' => 'verification_link_sent',
            ]);

        Notification::assertSentTo(
            $customer,
            CustomerVerifyEmail::class,
            function (CustomerVerifyEmail $notification) use ($customer): bool {
                $this->assertInstanceOf(ShouldQueue::class, $notification);

                $mail = $notification->toMail($customer);
                $this->assertStringContainsString('locale=jp', $mail->actionUrl);

                return true;
            }
        );
    }

    public function test_already_verified_customer_resend_returns_status(): void
    {
        Notification::fake();

        $customer = Customer::factory()->create([
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($customer, 'sanctum')
            ->postJson('/api/customer/email/resend');

        $response->assertOk()
            ->assertJson([
                'status' => 'already_verified',
            ]);

        Notification::assertNothingSent();
    }
}
