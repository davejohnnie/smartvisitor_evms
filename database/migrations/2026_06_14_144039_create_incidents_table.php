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
        Schema::create('incidents', function (Blueprint $table) {
            $table->id('i_id');
            $table->unsignedBigInteger('tenant_id');
            $table->unsignedBigInteger('resolved_by')->nullable();
            $table->string('type', 50);
            $table->enum('severity', ['low', 'medium', 'high']);
            $table->string('title', 150);
            $table->text('details');
            $table->enum('status', ['pending', 'resolved'])->default('pending');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->foreign('tenant_id')
                ->references('t_id')
                ->on('tenants')
                ->onDelete('cascade');

            $table->foreign('resolved_by')
                ->references('u_id')
                ->on('users')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incidents');
    }
};
