<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRoleType;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CategoriesTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsConsoleUser(array $overrides = []): User
    {
        $user = User::factory()->create(array_merge([
            'role' => UserRoleType::ADMIN->value,
            'account_status' => 'ACTIVE',
        ], $overrides));

        Sanctum::actingAs($user);

        return $user;
    }

    public function test_admin_can_create_category(): void
    {
        $this->actingAsConsoleUser();

        $payload = [
            'name'        => 'Groceries ' . Str::random(5),
            'description' => 'Everyday essentials',
            'isActive'    => 'ACTIVE',
        ];

        $this->postJson('/api/staff/categories', $payload)
            ->assertCreated();

        $this->assertDatabaseHas('categories', ['name' => $payload['name']]);
    }

    public function test_suspended_user_cannot_create_category(): void
    {
        $this->actingAsConsoleUser([
            'account_status' => 'SUSPENDED',
        ]);

        $payload = [
            'name'     => 'Suspended ' . Str::random(5),
            'isActive' => 'ACTIVE',
        ];

        $this->postJson('/api/staff/categories', $payload)
            ->assertForbidden();
    }

    public function test_staff_can_delete_category(): void
    {
        $this->actingAsConsoleUser([
            'role' => UserRoleType::STAFF->value,
        ]);

        $category = Category::factory()->create();

        $this->deleteJson("/api/staff/categories/{$category->id}")
            ->assertOk();

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }
}
