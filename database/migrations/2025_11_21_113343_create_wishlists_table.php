<?php
// database/migrations/2024_01_01_000000_create_wishlists_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWishlistsTable extends Migration
{
    public function up()
    {
        Schema::create('wishlists', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('product_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->unique(['user_id', 'product_id']);
            $table->index('user_id');
            $table->index('product_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('wishlists');
    }
}
