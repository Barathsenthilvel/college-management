<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fee_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fee_id')->constrained('fees')->onDelete('cascade');
            $table->decimal('amount', 10, 2);
            $table->enum('payment_mode', ['cash', 'upi', 'card', 'bank_transfer']);
            $table->string('transaction_ref')->nullable(); // For UPI/Bank ref numbers
            $table->date('payment_date');
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fee_transactions');
    }
};
