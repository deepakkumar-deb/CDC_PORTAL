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
        Schema::create('selection_rounds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jnf_id')->constrained('jnfs')->onDelete('cascade');
            $table->integer('round_order');
            $table->string('round_type');    // ppt, resume, test, gd, interview
            $table->string('mode')->nullable(); // online, offline, hybrid
            $table->string('test_type')->nullable(); // aptitude, technical, written
            $table->string('interview_mode')->nullable(); // oncampus, telephonic, video
            $table->text('description')->nullable();
            $table->datetime('tentative_date')->nullable();
            $table->integer('duration_minutes')->nullable();
            $table->boolean('is_elimination_round')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('selection_rounds');
    }
};
