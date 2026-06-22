<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('visits', function (Blueprint $table) {
            $table->index('visit_date');
            $table->index('status');
            $table->index('visit_type');
            $table->index(['visit_date', 'status']); // composite — covers your most common combined filter
        });

        Schema::table('incidents', function (Blueprint $table) {
            $table->index('status');
            $table->index('severity');
        });
    }

    public function down(): void
    {
        Schema::table('visits', function (Blueprint $table) {
            $table->dropIndex(['visit_date']);
            $table->dropIndex(['status']);
            $table->dropIndex(['visit_type']);
            $table->dropIndex(['visit_date', 'status']);
        });

        Schema::table('incidents', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['severity']);
        });
    }
};
