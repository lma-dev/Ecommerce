<?php

namespace Database\Factories;

use App\Enums\AccountStatusType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'  => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => $this->faker->password(),
            'account_status' => $this->faker->randomElement(AccountStatusType::getAllStatuses()),
            'phone' => $this->faker->phoneNumber(),
        ];
    }
}
