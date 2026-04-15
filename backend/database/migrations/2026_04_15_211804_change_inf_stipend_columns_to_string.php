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
        Schema::table('inf_stipend_breakdowns', function (Blueprint $table) {
            $table->string('base_stipend')->nullable()->change();
            $table->string('hra_housing')->nullable()->change();
            $table->string('variable_pay')->nullable()->change();
            $table->string('other_allowance')->nullable()->change();
            $table->string('total_stipend')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inf_stipend_breakdowns', function (Blueprint $table) {
            //
        });
    }
};
