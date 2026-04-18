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
        Schema::create('alumni_mentors', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('graduation_year');
            $table->string('branch');
            $table->string('company');
            $table->string('designation');
            $table->string('linkedin');
            $table->integer('years_of_experience');
            $table->string('preferred_mode');
            $table->integer('max_mentees');
            $table->text('expertise');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alumni_mentors');
    }
};
