<?php
// database/migrations/2024_01_01_create_slides_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSlidesTable extends Migration
{
    public function up()
    {
        Schema::create('slides', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('price');
            $table->string('original_price');
            $table->string('image');

            // Background customization fields
            $table->string('background_gradient')->default('from-green-200 via-green-100 to-green-200');
            $table->string('gradient_from')->default('#dcfce7');
            $table->string('gradient_via')->default('#f0fdf4');
            $table->string('gradient_to')->default('#dcfce7');
            $table->string('text_color')->default('text-slate-800');
            $table->string('button_color')->default('bg-slate-800');
            $table->string('button_text_color')->default('text-white');

            // Content customization fields
            $table->string('badge_text')->default('NEWS');
            $table->string('badge_color')->default('bg-green-600');
            $table->string('promotion_text')->default('Free Shipping on Orders Above $50!');
            $table->string('call_to_action')->default('SHOP NOW');

            // Status fields
            $table->boolean('is_active')->default(true);
            $table->integer('order')->default(0);

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('slides');
    }
}
