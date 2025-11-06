<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('site_name')->default('My Ecommerce Store');
            $table->string('admin_email')->default('admin@store.com');
            $table->string('mobile')->nullable();
            $table->string('address')->nullable();
            $table->text('site_description')->nullable();
            $table->integer('items_per_page')->default(24);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
