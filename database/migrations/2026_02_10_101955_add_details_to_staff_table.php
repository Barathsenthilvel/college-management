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
        Schema::table('staff', function (Blueprint $table) {
            $table->string('employee_id')->nullable()->after('name');
            $table->string('designation')->nullable()->after('department_id');
            $table->string('phone')->nullable()->after('email');
            $table->string('gender', 20)->nullable()->after('phone');
            $table->date('date_of_joining')->nullable()->after('gender');
            $table->text('address')->nullable()->after('date_of_joining');
            $table->string('photo_path')->nullable()->after('address');
            $table->enum('status', ['active', 'inactive'])->default('active')->after('photo_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('staff', function (Blueprint $table) {
            $table->dropColumn([
                'employee_id',
                'designation',
                'phone',
                'gender',
                'date_of_joining',
                'address',
                'photo_path',
                'status',
            ]);
        });
    }
};
