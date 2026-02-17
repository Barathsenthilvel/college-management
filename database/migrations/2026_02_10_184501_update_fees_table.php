<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('fees', function (Blueprint $table) {
            // Renaming amount to total_amount if not already done, or just using amount key as total
            // Let's rename for clarity if it's easy, or just add new columns.
            // Keeping 'amount' as 'total_amount' concept.
            $table->renameColumn('amount', 'total_amount');
            $table->string('type')->after('student_id'); // Tuition, Transport, etc.
            $table->date('due_date')->nullable()->after('total_amount');
            $table->dropColumn('paid_date'); // Moving to transactions
            // Status enum modification is tricky in standard migration without raw SQL, 
            // but for simplicity we can just modify the column if supported or leave as is 
            // and handle 'partial' in app logic if enum change is hard.
            // Best practice: Make it string or just alter it.
            // We will modify it to string to accept any status or use raw statement.
        });
        
        // Separate alteration for enum to avoid issues
        DB::statement("ALTER TABLE fees MODIFY COLUMN status ENUM('pending', 'partial', 'paid', 'overdue') DEFAULT 'pending'");
    }

    public function down(): void
    {
        Schema::table('fees', function (Blueprint $table) {
            $table->renameColumn('total_amount', 'amount');
            $table->dropColumn('type');
            $table->dropColumn('due_date');
            $table->date('paid_date')->nullable();
        });
        DB::statement("ALTER TABLE fees MODIFY COLUMN status ENUM('pending', 'paid', 'overdue') DEFAULT 'pending'");
    }
};
