<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('item_code')->unique();
            $table->string('name');
            $table->string('category_1');
            $table->string('category_2');
            $table->string('category_3');
            $table->string('model')->nullable();
            $table->string('hedding')->nullable();
            $table->string('warranty')->nullable();
            $table->text('description')->nullable();
            $table->text('specification')->nullable();
            $table->text('tags')->nullable();
            $table->string('specification_pdf_id')->nullable();
            $table->integer('total_views')->default(0);
            $table->string('youtube_video_id')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->integer('availability')->default(0);
            $table->decimal('buy_now_price', 10, 2)->nullable();
            $table->string('image')->nullable();
            $table->json('images')->nullable();
            $table->string('status')->default('disabled');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
