<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('category_id')->constrained()->onDelete('cascade');
            $table->string('item_code')->unique();
            $table->string('name');
            $table->string('model')->nullable();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->decimal('buy_now_price', 10, 2)->nullable();
            $table->string('hedding')->nullable();
            $table->string('warranty')->nullable();
            $table->text('specification')->nullable();
            $table->string('tags')->nullable();
            $table->string('specification_pdf_id')->nullable();
            $table->string('youtube_video_id')->nullable();
            $table->integer('availability')->default(0);
            $table->string('image')->nullable();
            $table->json('images')->nullable();
            $table->string('status')->default('disabled');
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
