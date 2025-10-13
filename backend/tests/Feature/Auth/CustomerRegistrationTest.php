<?php

namespace Tests\Feature\Auth;

use App\Models\Customer;
use App\Notifications\Auth\CustomerVerifyEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class CustomerRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_registration_sends_verification_notification(): void
    {
        Notification::fake();

        $payload = [
            'name' => 'Test Customer',
            'email' => 'customer@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'phone' => '0987654321',
            'locale' => 'mm',
        ];

        $response = $this->postJson('/api/customer/register', $payload);

        $response->assertCreated()
            ->assertJson([
                'message' => 'Customer registered successfully. Please verify your email address.',
                'requires_email_verification' => true,
            ]);

        $customer = Customer::where('email', $payload['email'])->first();
        $this->assertNotNull($customer);
        $this->assertNull($customer->email_verified_at);

        Notification::assertSentTo(
            $customer,
            CustomerVerifyEmail::class,
            function (CustomerVerifyEmail $notification) use ($customer): bool {
                $this->assertInstanceOf(ShouldQueue::class, $notification);

                $mail = $notification->toMail($customer);
                $this->assertStringContainsString('/api/customer/email/verify/'.$customer->id, $mail->actionUrl);
                $this->assertStringContainsString('locale=mm', $mail->actionUrl);

                return true;
            }
        );
    }

    public function test_unverified_customer_cannot_login(): void
    {
        $password = 'password123';

        Customer::factory()->create([
            'email' => 'login-test@example.com',
            'password' => Hash::make($password),
            'email_verified_at' => null,
        ]);

        $response = $this->postJson('/api/customer/login', [
            'email' => 'login-test@example.com',
            'password' => $password,
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'message' => 'Email address is not verified.',
            ]);
    }
}
