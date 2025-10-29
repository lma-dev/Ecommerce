<?php

namespace Tests\Feature\Admin;

use App\Enums\AccountStatusType;
use App\Enums\UserRoleType;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductsTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsAdmin(): User
    {
        $user = User::factory()->create([
            'role' => UserRoleType::ADMIN->value,
            'account_status' => AccountStatusType::ACTIVE->value,
        ]);
        Sanctum::actingAs($user);
        return $user;
    }

    public function test_index_products(): void
    {
        $this->actingAsAdmin();
        Product::factory()->count(2)->create();
        $res = $this->getJson('/api/staff/products');
        $res->assertOk()->assertJsonStructure(['data', 'meta']);
    }

    public function test_store_product(): void
    {
        $this->actingAsAdmin();
        $category = Category::factory()->create();
        $payload = [
            'name'        => 'Tea Leaves',
            'price'       => 1250,
            'categoryId'  => $category->id,
            'isActive'    => 'ACTIVE',
            'description' => 'Premium Myanmar tea leaves',
            'image'       => [
                'public_id' => 'ecommerce/test_public_id',
                'url'       => 'https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg',
                'format'    => 'jpg',
                'width'     => 800,
                'height'    => 600,
                'bytes'     => 123456,
            ],
        ];
        $res = $this->postJson('/api/staff/products', $payload);
        $res->assertCreated();
        $this->assertDatabaseHas('products', ['name' => 'Tea Leaves']);
    }

    public function test_store_product_rejects_suspended_user(): void
    {
        $user = User::factory()->create([
            'role' => UserRoleType::ADMIN->value,
            'account_status' => 'SUSPENDED',
        ]);

        Sanctum::actingAs($user);

        $category = Category::factory()->create();
        $payload = [
            'name'        => 'Blocked Product',
            'price'       => 500,
            'categoryId'  => $category->id,
            'isActive'    => 'ACTIVE',
            'image'       => [
                'public_id' => 'ecommerce/blocked',
                'url'       => 'https://res.cloudinary.com/demo/image/upload/v1234567890/blocked.jpg',
                'format'    => 'jpg',
                'width'     => 640,
                'height'    => 480,
                'bytes'     => 654321,
            ],
        ];

        $this->postJson('/api/staff/products', $payload)->assertForbidden();
    }

    public function test_index_products_handles_large_dataset(): void
    {
        $this->actingAsAdmin();

        Product::factory()
            ->count(120)
            ->sequence(fn(Sequence $sequence) => [
                'name' => 'Bulk Product ' . ($sequence->index + 1),
            ])
            ->create();

        $response = $this->getJson('/api/staff/products?limit=60');

        $response->assertOk()->assertJsonPath('meta.totalItems', 120);

        $this->assertSame(60, count($response->json('data')));
    }
}
