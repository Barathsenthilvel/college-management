import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function EnterMarks() {
    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);

    // Filters
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [examType, setExamType] = useState('midterm');

    // Data
    const [marks, setMarks] = useState({}); // { studentId: { marks_obtained: 0, total_marks: 100 } }
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (selectedDepartment && selectedYear) {
            fetchSubjects();
            fetchStudents();
        } else {
            setSubjects([]);
            setStudents([]);
        }
    }, [selectedDepartment, selectedYear]);

    useEffect(() => {
        if (selectedSubject && students.length > 0) {
            fetchExistingMarks();
        }
    }, [selectedSubject, students, examType]);

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/departments', { headers: { Authorization: `Bearer ${token}` } });
            setDepartments(response.data.data || response.data);
        } catch (error) {
            console.error('Failed to fetch departments', error);
        }
    };

    const fetchSubjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/subjects', {
                params: { department_id: selectedDepartment, year: selectedYear },
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubjects(response.data);
        } catch (error) {
            console.error('Failed to fetch subjects', error);
        }
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/students', {
                params: { department_id: selectedDepartment, year: selectedYear },
                headers: { Authorization: `Bearer ${token}` }
            });
            const studentsData = response.data.data || response.data;
            setStudents(studentsData);

            // Initialize marks state
            const initialMarks = {};
            studentsData.forEach(s => {
                initialMarks[s.id] = { marks_obtained: '', total_marks: 100 };
            });
            setMarks(initialMarks);

        } catch (error) {
            console.error('Failed to fetch students', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchExistingMarks = async () => {
        // Fetch existing marks for this subject/exam/year
        // Currently API filters by student_id or subject_id. 
        // We can fetch all marks for the subject and filter client side or backend should support class filtering.
        // Assuming we fetch by subject for now.
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/marks', {
                params: {
                    subject_id: selectedSubject,
                    year: selectedYear,
                    // Ideally filter by exam_type too but controller might not support it in index yet 
                    // Let's assume index returns all for subject/year and we filter.
                },
                headers: { Authorization: `Bearer ${token}` }
            });

            const existing = response.data.data || response.data;

            setMarks(prev => {
                const next = { ...prev };
                existing.forEach(mark => {
                    if (mark.exam_type === examType) {
                        next[mark.student_id] = {
                            marks_obtained: mark.marks_obtained,
                            total_marks: mark.total_marks
                        };
                    }
                });
                return next;
            });

        } catch (error) {
            console.error('Failed to fetch existing marks', error);
        }
    };

    const handleMarkChange = (studentId, field, value) => {
        setMarks(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value
            }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const marksPayload = students.map(student => ({
                student_id: student.id,
                subject_id: selectedSubject,
                exam_type: examType,
                year: selectedYear,
                marks_obtained: marks[student.id].marks_obtained || 0,
                total_marks: marks[student.id].total_marks || 100
            })).filter(m => m.marks_obtained !== ''); // Only send if marks entered? Or send 0?

            await axios.post('/api/marks', { marks: marksPayload }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Marks saved successfully!');
        } catch (error) {
            console.error('Failed to save marks', error);
            alert('Failed to save marks.');
        } finally {
            setSaving(false);
        }
    };

    // Auto-calculate Grade Helper
    const calculateGrade = (obtained, total) => {
        if (!obtained || !total || total == 0) return '-';
        const percentage = (obtained / total) * 100;
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        if (percentage >= 60) return 'C';
        if (percentage >= 50) return 'D';
        return 'F';
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-6">Enter Marks</h1>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                    <select
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                        <option value="">Select Department</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.department_name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
                    <select
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="">Select Year</option>
                        {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                    <select
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50/50 hover:bg-white disabled:opacity-50 disabled:bg-gray-100"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        disabled={!selectedYear}
                    >
                        <option value="">Select Subject</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_name} ({s.subject_code})</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Exam Type</label>
                    <select
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                        value={examType}
                        onChange={(e) => setExamType(e.target.value)}
                    >
                        <option value="midterm">Midterm</option>
                        <option value="final">Final / Semester</option>
                        <option value="assignment">Assignment</option>
                    </select>
                </div>
            </div>

            {/* Marks Table */}
            {selectedSubject && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500 font-medium">Loading students...</div>
                    ) : students.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <thead className="bg-gray-50/80">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-16">S.No</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Register No</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Marks Obtained</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total Marks</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-50">
                                        {students.map((student, index) => {
                                            const mark = marks[student.id] || { marks_obtained: '', total_marks: 100 };
                                            return (
                                                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{student.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm font-semibold text-center"
                                                            value={mark.marks_obtained}
                                                            onChange={(e) => handleMarkChange(student.id, 'marks_obtained', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm font-semibold text-center"
                                                            value={mark.total_marks}
                                                            onChange={(e) => handleMarkChange(student.id, 'total_marks', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-indigo-700">
                                                        {calculateGrade(mark.marks_obtained, mark.total_marks)}
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
                                    className="px-8 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-gray-400 transition-all duration-200"
                                >
                                    {saving ? 'Saving...' : 'Save Marks'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="p-12 text-center text-gray-500 font-medium">No students found.</div>
                    )}
                </div>
            )}
        </div>
    );
}
