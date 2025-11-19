<?php

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
            $table->json('theme_colors')->nullable();
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
