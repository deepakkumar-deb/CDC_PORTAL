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
        Schema::create('eligibility_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jnf_id')->constrained('jnfs')->onDelete('cascade');
            $table->decimal('min_cgpa', 4, 2)->nullable();
            $table->integer('max_backlogs_allowed')->nullable();
            $table->boolean('active_backlogs_allowed')->default(false);
            $table->decimal('min_class_10_percent', 5, 2)->nullable();
            $table->decimal('min_class_12_percent', 5, 2)->nullable();
            $table->string('allowed_gender')->default('all'); // all,male,female,other
            $table->text('additional_text')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eligibility_rules');
    }
};
