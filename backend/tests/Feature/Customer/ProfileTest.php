<?php

namespace Tests\Feature\Customer;

use App\Models\Customer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsCustomer(): Customer
    {
        $customer = Customer::factory()->create(['name' => 'Aye']);
        Sanctum::actingAs($customer);
        return $customer;
    }

    public function test_show_profile(): void
    {
        $this->actingAsCustomer();
        $this->getJson('/api/customer/me')->assertOk()->assertJsonStructure(['message','data' => ['id','name']]);
    }

    public function test_update_profile(): void
    {
        $this->actingAsCustomer();
        $res = $this->patchJson('/api/customer/me', ['name' => 'Aye Chan']);
        $res->assertOk();
        $this->assertDatabaseHas('customers', ['name' => 'Aye Chan']);
    }
}

