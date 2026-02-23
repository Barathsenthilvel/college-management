import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function ResultReports() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isStudent = user.role === 'student';

    const [departments, setDepartments] = useState([]);
    const [students, setStudents] = useState([]);

    // Filters
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(isStudent ? 'me' : '');

    // Results Data
    const [results, setResults] = useState([]);
    const [overallPercentage, setOverallPercentage] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (selectedDepartment && selectedYear) {
            fetchStudents();
        } else {
            setStudents([]);
        }
    }, [selectedDepartment, selectedYear]);

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/departments', { headers: { Authorization: `Bearer ${token}` } });
            setDepartments(response.data.data || response.data);
        } catch (error) {
            console.error('Failed to fetch departments', error);
        }
    };

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/students', {
                params: { department_id: selectedDepartment, year: selectedYear },
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(response.data.data || response.data);
        } catch (error) {
            console.error('Failed to fetch students', error);
        }
    };

    const fetchResults = async () => {
        if (!selectedStudent || !selectedYear) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/marks/results', {
                params: { student_id: selectedStudent, year: selectedYear },
                headers: { Authorization: `Bearer ${token}` }
            });
            setResults(response.data.results);
            setOverallPercentage(response.data.overall_percentage);
        } catch (error) {
            console.error('Failed to fetch results', error);
            alert('Failed to fetch results. Ensure data exists.');
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = () => {
        fetchResults();
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.text('Student Result Report', 105, 15, { align: 'center' });

        // Student Info
        doc.setFontSize(12);
        const student = students.find(s => s.id == selectedStudent);
        doc.text(`Name: ${student?.name || ''}`, 20, 30);
        doc.text(`Register No: ${student?.id || ''}`, 20, 38);
        doc.text(`Department: ${departments.find(d => d.id == selectedDepartment)?.department_name || ''}`, 20, 46);
        doc.text(`Year: ${selectedYear}`, 150, 46);

        // Table
        const tableData = results.map(r => [
            r.subject.subject_code,
            r.subject.subject_name,
            r.total_obtained,
            r.total_max,
            r.percentage + '%',
            r.percentage >= 50 ? 'Pass' : 'Fail'
        ]);

        doc.autoTable({
            startY: 55,
            head: [['Code', 'Subject', 'Marks Obtained', 'Total Marks', 'Percentage', 'Outcome']],
            body: tableData,
            theme: 'grid',
        });

        // Summary
        const finalY = doc.lastAutoTable.finalY || 150;
        doc.setFontSize(14);
        doc.text(`Overall Percentage: ${overallPercentage}%`, 20, finalY + 15);
        doc.text(`Status: ${overallPercentage >= 50 ? 'PASS' : 'FAIL'}`, 150, finalY + 15);

        doc.save('result-report.pdf');
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Result Reports</h1>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                {!isStudent && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                        >
                            <option value="">Select Department</option>
                            {departments.map(d => <option key={d.id} value={d.id}>{d.department_name}</option>)}
                        </select>
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <select
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        <option value="">Select Year</option>
                        {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                </div>
                {!isStudent && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            disabled={!selectedDepartment || !selectedYear}
                        >
                            <option value="">Select Student</option>
                            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                )}
                <div>
                    <button
                        onClick={handleGenerate}
                        disabled={!selectedStudent}
                        className="w-full px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 font-semibold"
                    >
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Result Display */}
            {!loading && results.length > 0 && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">Result Summary</h2>
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Download PDF</span>
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <span className="text-gray-500 text-sm">Overall %</span>
                                <div className="text-2xl font-bold text-indigo-600">{overallPercentage}%</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <span className="text-gray-500 text-sm">Status</span>
                                <div className={`text-2xl font-bold ${overallPercentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                                    {overallPercentage >= 50 ? 'PASS' : 'FAIL'}
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Code</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Obtained</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {results.map((res, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{res.subject?.subject_code}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{res.subject?.subject_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{res.subject?.credits}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{res.total_max}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{res.total_obtained} ({res.percentage}%)</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${res.percentage >= 50 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {res.percentage >= 50 ? 'Pass' : 'Fail'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
