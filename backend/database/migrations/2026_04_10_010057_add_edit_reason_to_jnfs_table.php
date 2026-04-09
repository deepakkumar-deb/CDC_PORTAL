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
        Schema::table('jnfs', function (Blueprint $table) {
            $table->text('edit_reason')->nullable()->after('is_edit_requested');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jnfs', function (Blueprint $table) {
            $table->dropColumn('edit_reason');
        });
    }
};
