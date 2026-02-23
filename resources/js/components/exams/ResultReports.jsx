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
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        {isStudent ? 'My Academic Results' : 'Result Reports'}
                    </h1>
                    <p className="mt-1 text-gray-500 font-medium text-sm">
                        {isStudent ? 'View your performance and download official report cards.' : 'Generate and download official student performance reports.'}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-2 text-indigo-700 font-bold mb-4 pb-4 border-b border-gray-100">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Report Configuration</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    {!isStudent && (
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
                    )}
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
                    {!isStudent && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Student</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white disabled:opacity-60 disabled:bg-gray-100 disabled:cursor-not-allowed font-medium text-gray-900"
                                value={selectedStudent}
                                onChange={(e) => setSelectedStudent(e.target.value)}
                                disabled={!selectedDepartment || !selectedYear}
                            >
                                <option value="" disabled>Select Student</option>
                                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                            </select>
                        </div>
                    )}
                    <div>
                        <button
                            onClick={handleGenerate}
                            disabled={!selectedStudent || loading}
                            className={`w-full px-6 py-3 text-white font-bold rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center space-x-2 ${!selectedStudent || loading
                                    ? 'bg-gray-300 cursor-not-allowed shadow-none text-gray-500'
                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)]'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <span>Generate Report</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Result Display */}
            {!loading && results.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6 animate-fade-in-up">
                    <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div>
                            <h2 className="text-xl font-extrabold text-gray-900">Academic Transcript</h2>
                            <p className="text-sm font-medium text-gray-500 mt-1">Official statement of marks for the selected term.</p>
                        </div>
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center space-x-2 bg-white text-indigo-700 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-300 font-bold py-2.5 px-5 rounded-xl transition-colors shadow-sm"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Download PDF</span>
                        </button>
                    </div>

                    <div className="p-8">
                        {/* Summary Cards */}
                        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden">
                                <div className="absolute right-0 top-0 w-16 h-16 bg-indigo-100 rounded-bl-full opacity-50"></div>
                                <span className="text-indigo-600/80 font-bold text-xs uppercase tracking-wider block mb-1">Overall Percentage</span>
                                <div className="text-4xl font-black text-indigo-700">{overallPercentage.toFixed(1)}<span className="text-2xl text-indigo-400 -ml-1">%</span></div>
                            </div>
                            <div className={`p-5 rounded-2xl border shadow-sm relative overflow-hidden ${overallPercentage >= 50 ? 'bg-gradient-to-br from-emerald-50 to-white border-emerald-100' : 'bg-gradient-to-br from-rose-50 to-white border-rose-100'}`}>
                                <div className={`absolute right-0 top-0 w-16 h-16 rounded-bl-full opacity-50 ${overallPercentage >= 50 ? 'bg-emerald-100' : 'bg-rose-100'}`}></div>
                                <span className={`font-bold text-xs uppercase tracking-wider block mb-1 ${overallPercentage >= 50 ? 'text-emerald-600/80' : 'text-rose-600/80'}`}>Final Status</span>
                                <div className={`text-3xl font-black mt-1 ${overallPercentage >= 50 ? 'text-emerald-700' : 'text-rose-700'}`}>
                                    {overallPercentage >= 50 ? 'PASSED \u2713' : 'FAILED \u2715'}
                                </div>
                            </div>
                        </div>

                        {/* Results Table */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50/80 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject Details</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Credits</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Max Marks</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Obtained</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Outcome</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {results.map((res, index) => (
                                        <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">{res.subject?.subject_name}</div>
                                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-0.5">{res.subject?.subject_code}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">{res.subject?.credits}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-400">{res.total_max}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-black text-gray-900">{res.total_obtained}</span>
                                                <span className="text-xs font-bold text-indigo-600 ml-2 bg-indigo-50 px-2 py-0.5 rounded-md">({res.percentage}%)</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${res.percentage >= 50 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'}`}>
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
