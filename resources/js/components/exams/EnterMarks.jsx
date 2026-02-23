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
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Enter Student Marks</h1>
                    <p className="mt-1 text-gray-500 font-medium text-sm">Select a department and subject to begin entering internal or semester marks.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-2 text-indigo-700 font-bold mb-4 pb-4 border-b border-gray-100">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span>Selection Criteria</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                        >
                            <option value="">Select Department</option>
                            {departments.map(d => <option key={d.id} value={d.id}>{d.department_name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Academic Year</label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            <option value="">Select Year</option>
                            {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y} / Sem {y * 2}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white disabled:opacity-60 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-900 font-medium"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            disabled={!selectedYear || subjects.length === 0}
                        >
                            <option value="" disabled>Select Subject</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_name} ({s.subject_code})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Exam Type</label>
                        <select
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white"
                            value={examType}
                            onChange={(e) => setExamType(e.target.value)}
                        >
                            <option value="midterm">Midterm Examination</option>
                            <option value="final">Final / Semester Exam</option>
                            <option value="assignment">Internal Assignment</option>
                        </select>
                    </div>
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
                                    <thead className="bg-gray-50/80 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-16">S.No</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student Details</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Marks Obtained</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total Marks</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider rounded-tr-xl">Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-50">
                                        {students.map((student, index) => {
                                            const mark = marks[student.id] || { marks_obtained: '', total_marks: 100 };
                                            return (
                                                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors duration-200 group">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-400">{index + 1}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-200 shadow-sm">
                                                                    {student.name.charAt(0)}
                                                                </div>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-bold text-gray-900">{student.name}</div>
                                                                <div className="text-xs font-medium text-gray-500 mt-0.5">Reg No: <span className="text-gray-700 uppercase">{student.id}</span></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="relative w-28">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-bold text-gray-900 shadow-sm hover:border-gray-400"
                                                                value={mark.marks_obtained}
                                                                onChange={(e) => handleMarkChange(student.id, 'marks_obtained', e.target.value)}
                                                                placeholder="--"
                                                            />
                                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                                <span className="text-gray-400 font-medium">/</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            className="w-24 px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-semibold text-gray-700 shadow-sm text-center"
                                                            value={mark.total_marks}
                                                            onChange={(e) => handleMarkChange(student.id, 'total_marks', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold shadow-sm ${calculateGrade(mark.marks_obtained, mark.total_marks) === 'A+' || calculateGrade(mark.marks_obtained, mark.total_marks) === 'A' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                            calculateGrade(mark.marks_obtained, mark.total_marks) === 'B' || calculateGrade(mark.marks_obtained, mark.total_marks) === 'C' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                                calculateGrade(mark.marks_obtained, mark.total_marks) === 'D' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                                    calculateGrade(mark.marks_obtained, mark.total_marks) === 'F' ? 'bg-red-100 text-red-700 border border-red-200' :
                                                                        'bg-gray-100 text-gray-500 border border-gray-200'
                                                            }`}>
                                                            {calculateGrade(mark.marks_obtained, mark.total_marks)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50/80 rounded-b-2xl">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:bg-indigo-700 disabled:bg-gray-300 disabled:shadow-none transition-all duration-200 flex items-center space-x-2"
                                >
                                    {saving ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Saving Marks...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Save & Confirm Marks</span>
                                            <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </>
                                    )}
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
