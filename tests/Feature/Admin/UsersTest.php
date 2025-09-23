<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRoleType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UsersTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsSuperAdmin(): User
    {
        $user = User::factory()->create(['role' => UserRoleType::SUPER_ADMIN->value]);
        Sanctum::actingAs($user);
        return $user;
    }

    public function test_store_user(): void
    {
        $this->actingAsSuperAdmin();
        $payload = [
            'name' => 'Admin Two',
            'email' => 'admin2@example.com',
            'password' => '12345678',
            'role' => UserRoleType::ADMIN->value,
            'accountStatus' => 'ACTIVE',
        ];
        $res = $this->postJson('/api/staff/users', $payload);
        $res->assertCreated();
        $this->assertDatabaseHas('users', ['email' => 'admin2@example.com']);
    }

    public function test_destroy_user(): void
    {
        $this->actingAsSuperAdmin();
        $target = User::factory()->create(['role' => UserRoleType::STAFF->value]);
        $res = $this->deleteJson("/api/staff/users/{$target->id}");
        $res->assertOk();
        $this->assertDatabaseMissing('users', ['id' => $target->id]);
    }
}
