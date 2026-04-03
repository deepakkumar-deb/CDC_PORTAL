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
        Schema::create('selection_infrastructure', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jnf_id')->constrained('jnfs')->onDelete('cascade');
            $table->integer('rooms_required')->nullable();
            $table->integer('team_members_required')->nullable();
            $table->boolean('psychometric_test')->default(false);
            $table->boolean('medical_test')->default(false);
            $table->boolean('proctoring_required')->default(false);
            $table->text('other_screening')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('selection_infrastructure');
    }
};
