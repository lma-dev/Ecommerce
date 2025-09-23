<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRoleType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_returns_counts(): void
    {
        $user = User::factory()->create(['role' => UserRoleType::ADMIN->value]);
        Sanctum::actingAs($user);

        $res = $this->getJson('/api/staff/dashboard');
        $res->assertOk()->assertJsonStructure([
            'message',
            'data' => [
                'pendingOrdersCount',
                'completedOrdersTotalAmount',
                'customersCount',
                'usersCount',
                'productsCount',
            ],
        ]);
    }
}

