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
        Schema::create('tenants', function (Blueprint $table) {
            $table->id('t_id');
            $table->unsignedBigInteger('u_id');
            $table->string('phone_number', 20);
            $table->string('unit_number', 10);
            $table->string('block', 5);
            $table->date('lease_start')->nullable();
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
        Schema::dropIfExists('tenants');
    }
};
