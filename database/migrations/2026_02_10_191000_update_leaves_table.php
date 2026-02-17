<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leaves', function (Blueprint $table) {
            $table->enum('leave_type', ['sick', 'casual', 'emergency', 'other'])->default('casual')->after('user_id');
            $table->string('attachment')->nullable()->after('reason');
        });
    }

    public function down(): void
    {
        Schema::table('leaves', function (Blueprint $table) {
            $table->dropColumn(['leave_type', 'attachment']);
        });
    }
};
