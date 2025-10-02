<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRoleType;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Support\Facades\Hash;
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

    public function test_index_customers_handles_large_dataset(): void
    {
        $this->actingAsAdmin();

        $hashedPassword = Hash::make('password');

        Customer::factory()
            ->count(80)
            ->sequence(fn (Sequence $sequence) => [
                'email' => 'bulk-customer-'.($sequence->index + 1).'@example.com',
                'phone' => '+959'.str_pad((string) ($sequence->index + 1000000), 9, '0', STR_PAD_LEFT),
                'password' => $hashedPassword,
            ])
            ->create();

        $response = $this->getJson('/api/staff/customers?limit=50');

        $response->assertOk()->assertJsonPath('meta.totalItems', 80);

        $this->assertSame(50, count($response->json('data')));
    }
}
