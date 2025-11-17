<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Create order_items table
        Schema::create('order_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('order_id')
                ->constrained('orders', 'id')
                ->onDelete('cascade');
            $table->foreignUuid('product_id')
                ->constrained('products', 'id')
                ->onDelete('cascade');
            $table->integer('quantity');
            $table->decimal('price', 10, 2);
            $table->timestamps();
        });

        // Safely add cancellation fields if they don't exist
        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'cancellation_reason')) {
                $table->text('cancellation_reason')->nullable()->after('status');
            }
            if (!Schema::hasColumn('orders', 'cancelled_by')) {
                $table->foreignUuid('cancelled_by')->nullable()->after('cancellation_reason');
            }
            if (!Schema::hasColumn('orders', 'cancelled_at')) {
                $table->timestamp('cancelled_at')->nullable()->after('cancelled_by');
            }
        });

        // Add foreign key constraint safely
        if (Schema::hasColumn('orders', 'cancelled_by')) {
            Schema::table('orders', function (Blueprint $table) {
                $table->foreign('cancelled_by')->references('id')->on('users')->onDelete('set null');
            });
        }
    }

    public function down(): void
    {
        // Drop order_items table
        Schema::dropIfExists('order_items');

        // Safely remove cancellation fields if they exist
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'cancellation_reason')) {
                $table->dropColumn('cancellation_reason');
            }
            if (Schema::hasColumn('orders', 'cancelled_by')) {
                $table->dropColumn('cancelled_by');
            }
            if (Schema::hasColumn('orders', 'cancelled_at')) {
                $table->dropColumn('cancelled_at');
            }
        });
    }
};
