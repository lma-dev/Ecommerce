<?php

namespace Tests\Feature\Customer;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CatalogTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsCustomer(): Customer
    {
        $customer = Customer::factory()->create();
        Sanctum::actingAs($customer);
        return $customer;
    }

    public function test_list_categories_and_products(): void
    {
        $this->actingAsCustomer();
        Category::factory()->count(2)->create();
        Product::factory()->count(3)->create();

        $this->getJson('/api/customer/categories')->assertOk();
        $this->getJson('/api/customer/products')->assertOk();
    }
}
