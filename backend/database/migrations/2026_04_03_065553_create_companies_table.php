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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('company_name');
            $table->string('logo_path')->nullable();
            $table->string('website')->nullable();
            $table->string('industry')->nullable();
            $table->string('company_type')->nullable();  // startup, mnc, psu, etc
            $table->text('about_company')->nullable();
            $table->text('headquarters_address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->default('India');
            $table->string('postal_code')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->date('date_of_establishment')->nullable();
            $table->string('annual_turnover')->nullable();
            $table->string('no_of_employees')->nullable();
            $table->json('industry_tags')->nullable();
            $table->string('mnc_hq_country')->nullable();
            $table->string('mnc_hq_city')->nullable();
            $table->string('company_file_path')->nullable();
            $table->string('company_file_original_name')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
