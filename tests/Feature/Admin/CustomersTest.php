<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRoleType;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CustomersTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsAdmin(): User
    {
        $user = User::factory()->create(['role' => UserRoleType::ADMIN->value]);
        Sanctum::actingAs($user);
        return $user;
    }

    public function test_index_customers(): void
    {
        $this->actingAsAdmin();
        Customer::factory()->count(2)->create();
        $res = $this->getJson('/api/staff/customers');
        $res->assertOk()->assertJsonStructure(['data', 'meta']);
    }

    public function test_store_customer(): void
    {
        $this->actingAsAdmin();
        $payload = [
            'name' => 'Mya',
            'email' => 'mya@example.com',
            'password' => '12345678',
            'phone' => '+959123456789',
        ];
        $res = $this->postJson('/api/staff/customers', $payload);
        $res->assertCreated();
        $this->assertDatabaseHas('customers', ['email' => 'mya@example.com']);
    }
}
