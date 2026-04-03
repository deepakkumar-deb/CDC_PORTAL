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
        Schema::create('jnfs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->onDelete('cascade');
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('jnf_code')->unique()->nullable();
            $table->string('recruitment_cycle')->nullable();   // 2025-26
            $table->string('opportunity_type')->default('job'); // job, internship
            $table->string('internship_title')->nullable();
            $table->string('designation')->nullable();
            $table->string('department_function')->nullable();
            $table->text('job_description')->nullable();
            $table->text('responsibilities')->nullable();
            $table->string('location_type')->nullable();       // onsite, remote, hybrid
            $table->string('location_text')->nullable();
            $table->integer('openings_count')->nullable();
            $table->integer('min_openings')->nullable();
            $table->date('start_date')->nullable();
            $table->date('tentative_joining_date')->nullable();
            $table->integer('internship_duration_months')->nullable();
            $table->string('expected_duration')->nullable();
            $table->boolean('ppo_offered')->default(false);
            $table->string('registration_link')->nullable();
            $table->text('additional_info')->nullable();
            $table->text('slp_requirements')->nullable();
            $table->string('status')->default('draft'); // draft,submitted,approved,rejected
            $table->datetime('submitted_at')->nullable();
            $table->datetime('approved_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jnfs');
    }
};
