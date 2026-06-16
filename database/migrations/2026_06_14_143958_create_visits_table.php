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
        Schema::create('visits', function (Blueprint $table) {
            $table->id('visit_id');
            $table->unsignedBigInteger('tenant_id');
            $table->unsignedBigInteger('visitor_id');
            $table->unsignedBigInteger('guard_id')->nullable();
            $table->string('purpose', 100);
            $table->string('qr_token', 64)->unique();
            $table->enum('visit_type', ['invited', 'walkin'])->default('invited');
            $table->enum('status', ['pending', 'checked-in', 'checked-out'])->default('pending');
            $table->date('visit_date');
            $table->time('expected_time_in');
            $table->time('expected_time_out');
            $table->timestamp('check_in')->nullable();
            $table->timestamp('check_out')->nullable();
            $table->boolean('overstay_notified')->default(false);
            $table->timestamps();

            $table->foreign('tenant_id')
                ->references('t_id')
                ->on('tenants')
                ->onDelete('cascade');

            $table->foreign('visitor_id')
                ->references('v_id')
                ->on('visitors')
                ->onDelete('cascade');

            $table->foreign('guard_id')
                ->references('guard_id')
                ->on('guards')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visits');
    }
};
