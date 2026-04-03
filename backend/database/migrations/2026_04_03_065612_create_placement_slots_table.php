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
        Schema::create('placement_slots', function (Blueprint $table) {
            $table->id();
            $table->integer('season_year');
            $table->integer('slot_number');
            $table->integer('phase')->default(1);
            $table->datetime('start_datetime');
            $table->datetime('end_datetime');
            $table->string('slot_type')->nullable(); // day1, day2, lateral
            $table->boolean('is_final_round')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('placement_slots');
    }
};
