<!DOCTYPE html>
<html>
<head>
    <title>Fee Receipt</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .receipt-info { margin-bottom: 20px; }
        .amount { font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>FEE RECEIPT</h1>
    </div>
    
    <div class="receipt-info">
        <p><strong>Receipt ID:</strong> #{{ $fee->id }}</p>
        <p><strong>Student Name:</strong> {{ $fee->student->name }}</p>
        <p><strong>Email:</strong> {{ $fee->student->email }}</p>
        <p><strong>Department:</strong> {{ $fee->student->department->department_name }}</p>
        <p><strong>Paid Date:</strong> {{ $fee->paid_date ? $fee->paid_date->format('Y-m-d') : 'N/A' }}</p>
        <p><strong>Status:</strong> {{ ucfirst($fee->status) }}</p>
    </div>

    <div class="amount">
        Amount: ${{ number_format($fee->amount, 2) }}
    </div>

    <p style="margin-top: 40px;"><strong>Date:</strong> {{ now()->format('Y-m-d H:i:s') }}</p>
</body>
</html>

