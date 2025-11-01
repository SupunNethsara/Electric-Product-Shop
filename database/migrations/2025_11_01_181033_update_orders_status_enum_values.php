<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // First update existing data to match new enum values
        DB::table('orders')->where('status', 'delivered')->update(['status' => 'completed']);

        // Then modify the column
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'contacted', 'processing', 'shipped', 'completed', 'cancelled') DEFAULT 'pending'");
    }

    public function down()
    {
        // Revert data changes
        DB::table('orders')->where('status', 'completed')->update(['status' => 'delivered']);

        // Revert column modification
        DB::statement("ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'processing', 'delivered', 'cancelled') DEFAULT 'pending'");
    }
};
