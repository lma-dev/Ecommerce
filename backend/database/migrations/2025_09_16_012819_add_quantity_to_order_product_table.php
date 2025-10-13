<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_product', function (Blueprint $table) {
            $table->unsignedInteger('quantity')->default(1)->after('product_id');
        });

        // Ensure existing rows have quantity set to 1 explicitly (for older MySQL versions)
        DB::table('order_product')->whereNull('quantity')->update(['quantity' => 1]);
    }

    public function down(): void
    {
        Schema::table('order_product', function (Blueprint $table) {
            $table->dropColumn('quantity');
        });
    }
};

