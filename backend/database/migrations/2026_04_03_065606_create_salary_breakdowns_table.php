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
        Schema::create('salary_breakdowns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jnf_id')->constrained('jnfs')->onDelete('cascade');
            $table->string('programme_type');  // btech_dual, mtech, mba, msc, phd
            $table->string('currency')->default('INR');
            $table->decimal('ctc_annual', 12, 2)->nullable();
            $table->decimal('base_fixed', 12, 2)->nullable();
            $table->decimal('monthly_takehome', 12, 2)->nullable();
            $table->decimal('gross_salary', 12, 2)->nullable();
            $table->decimal('joining_bonus', 12, 2)->nullable();
            $table->decimal('retention_bonus', 12, 2)->nullable();
            $table->decimal('relocation_allowance', 12, 2)->nullable();
            $table->decimal('medical_allowance', 12, 2)->nullable();
            $table->decimal('esop_value', 12, 2)->nullable();
            $table->string('vest_period')->nullable();
            $table->decimal('first_year_ctc', 12, 2)->nullable();
            $table->string('stocks_options')->nullable();
            $table->boolean('bond_required')->default(false);
            $table->decimal('bond_amount', 12, 2)->nullable();
            $table->integer('bond_duration_months')->nullable();
            $table->text('bond_details')->nullable();
            $table->text('deductions_text')->nullable();
            $table->text('ctc_breakup_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salary_breakdowns');
    }
};
