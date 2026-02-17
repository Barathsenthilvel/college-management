<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('subjects', function (Blueprint $table) {
            $table->integer('year')->after('department_id')->nullable(); // Year/Class (1, 2, 3, 4)
            $table->foreignId('staff_id')->nullable()->constrained('staff')->onDelete('set null')->after('year'); // Assigned Staff
            $table->enum('status', ['active', 'inactive'])->default('active')->after('credits');
        });
    }

    public function down(): void
    {
        Schema::table('subjects', function (Blueprint $table) {
            $table->dropColumn(['year', 'staff_id', 'status']);
        });
    }
};
