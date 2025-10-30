<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')
                ->constrained()
                ->onDelete('cascade');
            $table->string('order_code')->unique();
            $table->decimal('total_amount', 10, 2);
            $table->decimal('delivery_fee', 8, 2)->default(0);
            $table->enum('delivery_option', ['standard', 'express'])->default('standard');
            $table->enum('payment_method', ['cash_on_delivery', 'online'])->default('cash_on_delivery');
            $table->enum('status', ['pending', 'processing', 'delivered', 'cancelled'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('orders');
    }
};
