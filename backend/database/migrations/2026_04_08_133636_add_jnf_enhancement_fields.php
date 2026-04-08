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
        Schema::table('jnfs', function (Blueprint $table) {
            $table->text('onboarding_procedure')->nullable()->after('slp_requirements');
        });

        Schema::table('salary_breakdowns', function (Blueprint $table) {
            $table->decimal('variable_performance_bonus', 12, 2)->nullable()->after('first_year_ctc');
        });

        Schema::table('jnf_dept_cgpa', function (Blueprint $table) {
            $table->boolean('active_backlogs_allowed')->default(false)->after('min_cgpa');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jnf_dept_cgpa', function (Blueprint $table) {
            $table->dropColumn('active_backlogs_allowed');
        });

        Schema::table('salary_breakdowns', function (Blueprint $table) {
            $table->dropColumn('variable_performance_bonus');
        });

        Schema::table('jnfs', function (Blueprint $table) {
            $table->dropColumn('onboarding_procedure');
        });
    }
};
