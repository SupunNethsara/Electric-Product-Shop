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
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('site_name')->default('My Ecommerce Store');
            $table->string('admin_email')->default('admin@store.com');
            $table->string('mobile')->nullable();
            $table->string('address')->nullable();
            $table->string('logo')->nullable();
            $table->string('logo_url')->nullable();
            $table->text('site_description')->nullable();
            $table->text('google_maps_embed')->nullable();
            $table->string('contact_email')->nullable();
            $table->text('business_hours')->nullable();
            $table->json('social_links')->nullable();
            $table->integer('items_per_page')->default(24);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
