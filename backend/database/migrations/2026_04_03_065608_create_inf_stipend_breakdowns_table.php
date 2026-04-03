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
        Schema::create('inf_stipend_breakdowns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jnf_id')->constrained('jnfs')->onDelete('cascade');
            $table->string('programme_type');   // btech_dual, mtech, mba, msc, phd
            $table->string('currency')->default('INR');
            $table->decimal('base_stipend', 12, 2)->nullable();
            $table->decimal('hra_housing', 12, 2)->nullable();
            $table->decimal('variable_pay', 12, 2)->nullable();
            $table->decimal('other_allowance', 12, 2)->nullable();
            $table->decimal('total_stipend', 12, 2)->nullable();
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inf_stipend_breakdowns');
    }
};
