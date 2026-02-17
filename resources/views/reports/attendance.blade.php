<!DOCTYPE html>
<html>
<head>
    <title>Attendance Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .student-info { margin-bottom: 20px; }
        .summary { margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div class="header">
        <h1>ATTENDANCE REPORT</h1>
    </div>
    
    <div class="student-info">
        <p><strong>Student Name:</strong> {{ $student->name }}</p>
        <p><strong>Email:</strong> {{ $student->email }}</p>
        <p><strong>Department:</strong> {{ $student->department->department_name }}</p>
        <p><strong>Period:</strong> {{ $from_date }} to {{ $to_date }}</p>
    </div>

    <div class="summary">
        <h3>Summary</h3>
        <p><strong>Total Days:</strong> {{ $total_days }}</p>
        <p><strong>Present Days:</strong> {{ $present_days }}</p>
        <p><strong>Absent Days:</strong> {{ $absent_days }}</p>
        <p><strong>Late Days:</strong> {{ $late_days }}</p>
        <p><strong>Attendance Percentage:</strong> {{ $percentage }}%</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($attendance as $record)
            <tr>
                <td>{{ $record->date->format('Y-m-d') }}</td>
                <td>{{ ucfirst($record->status) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>

