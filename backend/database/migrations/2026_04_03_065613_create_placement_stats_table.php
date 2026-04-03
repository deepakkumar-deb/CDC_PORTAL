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
        Schema::create('placement_stats', function (Blueprint $table) {
            $table->id();
            $table->integer('year');
            $table->integer('companies_count')->default(0);
            $table->decimal('placement_percent', 5, 2)->default(0);
            $table->decimal('highest_ctc', 12, 2)->default(0);
            $table->integer('departments_count')->default(0);
            $table->timestamp('updated_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('placement_stats');
    }
};
