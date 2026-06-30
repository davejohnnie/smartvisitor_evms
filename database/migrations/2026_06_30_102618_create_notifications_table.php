<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id('notification_id');
            $table->unsignedBigInteger('u_id');
            $table->enum('type', ['visitor_arrived', 'overstay', 'incident_resolved']);
            $table->string('message', 255);
            $table->boolean('is_read')->default(false);
            $table->timestamps();

            $table->foreign('u_id')
                ->references('u_id')
                ->on('users')
                ->onDelete('cascade');

            $table->index(['u_id', 'is_read']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
