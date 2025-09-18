<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRoleType;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CategoriesTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsStaff(): User
    {
        $user = User::factory()->create(['role' => UserRoleType::STAFF->value]);
        Sanctum::actingAs($user);
        return $user;
    }

    public function test_index_categories(): void
    {
        $this->actingAsStaff();
        Category::factory()->count(2)->create();
        $res = $this->getJson('/api/staff/categories');
        $res->assertOk()->assertJsonStructure(['data', 'meta']);
    }

    public function test_store_category(): void
    {
        $this->actingAsStaff();
        $res = $this->postJson('/api/staff/categories', [
            'name' => 'Snacks',
            'description' => 'Myanmar snacks',
        ]);
        $res->assertCreated();
        $this->assertDatabaseHas('categories', ['name' => 'Snacks']);
    }

    public function test_index_categories_handles_large_dataset(): void
    {
        $this->actingAsStaff();

        Category::factory()
            ->count(80)
            ->sequence(fn (Sequence $sequence) => [
                'name' => 'Bulk Category '.($sequence->index + 1),
            ])
            ->create();

        $response = $this->getJson('/api/staff/categories?limit=50');

        $response->assertOk()->assertJsonPath('meta.totalItems', 80);

        $this->assertSame(50, count($response->json('data')));
    }
}
