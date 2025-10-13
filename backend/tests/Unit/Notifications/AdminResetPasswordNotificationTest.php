<?php

namespace Tests\Unit\Notifications;

use App\Models\User;
use App\Notifications\Auth\AdminResetPassword;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminResetPasswordNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_reset_password_notification_is_queued_and_uses_shared_path_with_type(): void
    {
        $user = User::factory()->create();

        $notification = new AdminResetPassword('admin-token', 'en');

        $this->assertInstanceOf(ShouldQueue::class, $notification);

        $mail = $notification->toMail($user);

        $this->assertStringContainsString('/en/password-reset/admin-token', $mail->actionUrl);
        $this->assertStringContainsString('type=console', $mail->actionUrl);
        $this->assertStringContainsString('email=' . urlencode($user->email), $mail->actionUrl);
    }
}
