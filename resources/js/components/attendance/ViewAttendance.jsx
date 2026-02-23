import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ViewAttendance() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isStudent = user.role === 'student';

    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({}); // { studentId: { status: 'present', remarks: '', late_hours: 0 } }

    // For student history
    const [attendanceHistory, setAttendanceHistory] = useState([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isStudent) {
            fetchStudentHistory();
        } else {
            fetchDepartments();
        }
    }, [isStudent]);

    useEffect(() => {
        if (!isStudent && selectedDepartment && selectedYear && selectedDate) {
            fetchStudentsAndAttendance();
        } else if (!isStudent) {
            setStudents([]);
        }
    }, [selectedDepartment, selectedYear, selectedDate, isStudent]);

    const fetchStudentHistory = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/attendance', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAttendanceHistory(response.data.data || response.data);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/departments', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDepartments(response.data.data || response.data);
        } catch (error) {
            console.error('Failed to fetch departments:', error);
        }
    };

    const fetchStudentsAndAttendance = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            // Fetch students
            const studentsResponse = await axios.get('/api/students', {
                params: { department_id: selectedDepartment, year: selectedYear },
                headers: { Authorization: `Bearer ${token}` },
            });
            const studentsData = studentsResponse.data.data || studentsResponse.data;

            // Filter by year if API doesn't support it directly (assuming API might not filter by year yet)
            // But we can filter client side just in case
            const filteredStudents = studentsData.filter(s => s.year === parseInt(selectedYear));
            setStudents(filteredStudents);

            // Fetch existing attendance
            const attendanceResponse = await axios.get('/api/attendance', {
                params: { date: selectedDate, department_id: selectedDepartment },
                headers: { Authorization: `Bearer ${token}` },
            });
            const attendanceData = attendanceResponse.data.data || attendanceResponse.data;

            // Map attendance to state
            const newAttendance = {};
            // Initialize with default 'present' for all students if no record exists?
            // Or leave empty to force user to mark? User usually wants default present.
            // Let's set default present for all students, overwrite with existing data.

            filteredStudents.forEach(student => {
                newAttendance[student.id] = {
                    status: 'present',
                    remarks: '',
                    late_hours: null
                };
            });

            attendanceData.forEach(record => {
                if (newAttendance[record.student_id]) {
                    newAttendance[record.student_id] = {
                        status: record.status,
                        remarks: record.remarks || '',
                        late_hours: record.late_hours
                    };
                }
            });

            setAttendance(newAttendance);

        } catch (error) {
            console.error('Failed to fetch data:', error);
            alert('Failed to load students or attendance data.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                status: status,
                late_hours: status === 'late' ? (prev[studentId].late_hours || 1) : null
            }
        }));
    };

    const handleRemarksChange = (studentId, remarks) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                remarks: remarks
            }
        }));
    };

    const handleLateHoursChange = (studentId, hours) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                late_hours: hours
            }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const attendanceData = students.map(student => ({
                student_id: student.id,
                status: attendance[student.id].status,
                remarks: attendance[student.id].remarks,
                late_hours: attendance[student.id].status === 'late' ? attendance[student.id].late_hours : null
            }));

            await axios.post(
                '/api/attendance/bulk',
                { date: selectedDate, attendance: attendanceData },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert('Attendance saved successfully!');
        } catch (error) {
            console.error('Error saving attendance:', error);
            alert('Failed to save attendance.');
        } finally {
            setSaving(false);
        }
    };

    // Helper to get Department Name
    const getDepartmentName = (id) => {
        const dept = departments.find(d => d.id === parseInt(id));
        return dept ? dept.department_name : '';
    };

    if (isStudent) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-6">My Attendance History</h1>
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-500 font-medium">Loading history...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50/80">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {attendanceHistory.length > 0 ? attendanceHistory.map((record) => (
                                        <tr key={record.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {new Date(record.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${record.status === 'present' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    record.status === 'absent' ? 'bg-red-50 text-red-700 border-red-200' :
                                                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                    }`}>
                                                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                                    {record.status === 'late' && record.late_hours ? ` (${record.late_hours} hrs)` : ''}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {record.remarks || '-'}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-12 text-center text-gray-500 font-medium">No attendance records found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-6">View Attendance</h1>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                        <select
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.department_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Year / Class</label>
                        <select
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            <option value="">Select Year</option>
                            {[1, 2, 3, 4].map(year => (
                                <option key={year} value={year}>Year {year}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table or Empty State */}
            {selectedDepartment && selectedYear ? (
                loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-500 font-medium">Loading students...</p>
                    </div>
                ) : students.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-800">
                                Students List ({students.length})
                            </h2>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-all duration-200 font-semibold shadow-sm"
                            >
                                {saving ? 'Saving...' : 'Save Attendance'}
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50/80">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-16">
                                            S.No
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Student Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Register No / ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Remarks
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {students.map((student, index) => {
                                        const record = attendance[student.id] || { status: 'present', remarks: '' };
                                        return (
                                            <tr key={student.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900">{student.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {student.id} {/* Using ID as Register No for now */}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {getDepartmentName(student.department_id)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleStatusChange(student.id, 'present')}
                                                            className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${record.status === 'present'
                                                                ? 'bg-green-100 text-green-800 border-green-200 border shadow-sm'
                                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
                                                                }`}
                                                        >
                                                            Present
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(student.id, 'absent')}
                                                            className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${record.status === 'absent'
                                                                ? 'bg-red-100 text-red-800 border-red-200 border shadow-sm'
                                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
                                                                }`}
                                                        >
                                                            Absent
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusChange(student.id, 'late')}
                                                            className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${record.status === 'late'
                                                                ? 'bg-yellow-100 text-yellow-800 border-yellow-200 border shadow-sm'
                                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'
                                                                }`}
                                                        >
                                                            Late
                                                        </button>
                                                    </div>
                                                    {record.status === 'late' && (
                                                        <div className="mt-3 flex items-center space-x-2">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max="24"
                                                                step="0.5"
                                                                value={record.late_hours || ''}
                                                                onChange={(e) => handleLateHoursChange(student.id, e.target.value)}
                                                                placeholder="Hrs"
                                                                className="w-20 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                                            />
                                                            <span className="text-xs font-semibold text-gray-500">hrs</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <input
                                                        type="text"
                                                        value={record.remarks}
                                                        onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                                                        placeholder="Add remarks..."
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50/50">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-all duration-200 font-semibold shadow-sm"
                            >
                                {saving ? 'Saving...' : 'Save Attendance'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <h3 className="mt-4 text-sm font-bold text-gray-900">No students found</h3>
                        <p className="mt-1 text-sm text-gray-500 font-medium">Try selecting a different department or year.</p>
                    </div>
                )
            ) : (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-4 text-sm font-bold text-gray-900">Select Filters</h3>
                    <p className="mt-1 text-sm text-gray-500 font-medium">Please select Department and Year to view students.</p>
                </div>
            )}
        </div>
    );
}
