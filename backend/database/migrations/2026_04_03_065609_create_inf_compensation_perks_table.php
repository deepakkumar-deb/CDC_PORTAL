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
        Schema::create('inf_compensation_perks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jnf_id')->constrained('jnfs')->onDelete('cascade');
            $table->string('programme_type');
            $table->string('perk_label');     // Accommodation, Travel, Meal Card
            $table->string('perk_value')->nullable();
            $table->integer('display_order')->default(0);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inf_compensation_perks');
    }
};
