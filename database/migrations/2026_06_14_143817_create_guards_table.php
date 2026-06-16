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
        Schema::create('guards', function (Blueprint $table) {
            $table->id('guard_id');
            $table->unsignedBigInteger('u_id');
            $table->string('phone_number', 20);
            $table->string('badge_number', 20)->unique();
            $table->string('shift', 40);
            $table->enum('status', ['on-duty', 'off-duty'])->default('on-duty');
            $table->timestamps();

            $table->foreign('u_id')
                ->references('u_id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guards');
    }
};
