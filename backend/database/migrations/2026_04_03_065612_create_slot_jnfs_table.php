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
        Schema::create('slot_jnfs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('slot_id')->constrained('placement_slots')->onDelete('cascade');
            $table->foreignId('jnf_id')->constrained('jnfs')->onDelete('cascade');
            $table->string('form_type')->default('jnf');  // jnf or inf
            $table->date('ppt_date')->nullable();
            $table->date('test_date')->nullable();
            $table->integer('slot_order')->nullable();
            $table->boolean('confirmed')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('slot_jnfs');
    }
};
