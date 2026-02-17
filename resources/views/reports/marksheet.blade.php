<!DOCTYPE html>
<html>
<head>
    <title>Marksheet</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .student-info { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .total { font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>MARKSHEET</h1>
        <h2>Academic Year: {{ $year }}</h2>
    </div>
    
    <div class="student-info">
        <p><strong>Student Name:</strong> {{ $student->name }}</p>
        <p><strong>Email:</strong> {{ $student->email }}</p>
        <p><strong>Department:</strong> {{ $student->department->department_name }}</p>
        <p><strong>Year:</strong> {{ $student->year }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Subject</th>
                <th>Subject Code</th>
                <th>Marks Obtained</th>
                <th>Total Marks</th>
                <th>Percentage</th>
            </tr>
        </thead>
        <tbody>
            @foreach($results as $result)
            <tr>
                <td>{{ $result['subject']->subject_name }}</td>
                <td>{{ $result['subject']->subject_code }}</td>
                <td>{{ $result['total_obtained'] }}</td>
                <td>{{ $result['total_max'] }}</td>
                <td>{{ $result['percentage'] }}%</td>
            </tr>
            @endforeach
            <tr class="total">
                <td colspan="2">Overall Percentage</td>
                <td colspan="3">{{ $overall_percentage }}%</td>
            </tr>
        </tbody>
    </table>
</body>
</html>

