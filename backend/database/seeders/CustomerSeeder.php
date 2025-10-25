<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Customer::insert([
            'name' => 'Customer One',
            'email' => 'customer1@gmail.com',
            'phone' => '1234567890',
            'email_verified_at' => now(),
            'password' =>  Hash::make('12345678'),
            'remember_token' => Str::random(10),
            'account_status' => 'ACTIVE',
        ]);
        Customer::insert([
            'name' => 'Customer Two',
            'email' => 'customer2@gmail.com',
            'phone' => '1234567890',
            'email_verified_at' => now(),
            'password' =>  Hash::make('12345678'),
            'remember_token' => Str::random(10),
            'account_status' => 'ACTIVE',
        ]);

        $data = Customer::factory(5)->make();
        $chunks = $data->chunk(10);
        $chunks->each(function ($chunk) {
            Customer::insert($chunk->toArray());
        });
    }
}
