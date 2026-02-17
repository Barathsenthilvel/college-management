<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->decimal('marks_obtained', 5, 2);
            $table->decimal('total_marks', 5, 2)->default(100);
            $table->string('exam_type')->default('midterm'); // midterm, final, assignment
            $table->integer('year');
            $table->timestamps();
            
            $table->unique(['student_id', 'subject_id', 'exam_type', 'year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marks');
    }
};

