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
        Schema::create('inf_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jnf_id')->constrained('jnfs')->onDelete('cascade');
            $table->string('internship_type')->nullable();  // summer, winter, year-long
            $table->integer('duration_months')->nullable();
            $table->boolean('ppo_offered')->default(false);
            $table->decimal('ppo_ctc_expected', 12, 2)->nullable();
            $table->boolean('accommodation_provided')->default(false);
            $table->text('accommodation_details')->nullable();
            $table->boolean('travel_allowance')->default(false);
            $table->text('travel_allowance_details')->nullable();
            $table->boolean('certificate_provided')->default(true);
            $table->boolean('work_from_home_allowed')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inf_details');
    }
};
