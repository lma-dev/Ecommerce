<?php

namespace Database\Factories;

use App\Enums\OrderStatusType;
use App\Models\Customer;
use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id'      => Customer::factory(),
            'total_amount'     => 0,
            'status'           => $this->faker->randomElement(OrderStatusType::getAllStatuses()),
            'shipping_address' => $this->faker->address(),
            'notes'            => $this->faker->optional()->sentence(),
            'order_code'       => $this->faker->unique()->regexify('ORD-\d{6}-[A-Z0-9]{4}'),
        ];
    }
}
