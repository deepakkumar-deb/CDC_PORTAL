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
        Schema::table('salary_breakdowns', function (Blueprint $table) {
            $table->string('joining_bonus')->nullable()->change();
            $table->string('variable_performance_bonus')->nullable()->change();
            $table->string('retention_bonus')->nullable()->change();
            $table->string('relocation_allowance')->nullable()->change();
            $table->string('medical_allowance')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('salary_breakdowns', function (Blueprint $table) {
            //
        });
    }
};
