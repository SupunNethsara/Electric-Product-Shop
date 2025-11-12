<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('otp_verifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('email', 191);
            $table->string('otp', 6);
            $table->string('type', 50);
            $table->timestamp('expires_at');
            $table->boolean('is_used')->default(false);
            $table->integer('attempts')->default(0);
            $table->timestamps();
        });


        Schema::table('otp_verifications', function (Blueprint $table) {
            $table->index(['email', 'type'], 'otp_verifications_email_type_index');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('otp_verifications');
    }
};
