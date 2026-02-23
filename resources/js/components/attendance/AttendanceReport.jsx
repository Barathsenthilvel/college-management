import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AttendanceReport() {
    const [reportData, setReportData] = useState([]);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [loading, setLoading] = useState(false);

    // Set default date range (current month)
    useEffect(() => {
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
        setFromDate(firstDay);
        setToDate(lastDay);
    }, []);

    useEffect(() => {
        if (fromDate && toDate) {
            fetchReport();
        }
    }, [fromDate, toDate]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/attendance/department-report', {
                params: { from_date: fromDate, to_date: toDate },
                headers: { Authorization: `Bearer ${token}` },
            });
            setReportData(response.data);
        } catch (error) {
            console.error('Failed to fetch report:', error);
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: reportData.map(d => d.department_name),
        datasets: [
            {
                label: 'Present',
                data: reportData.map(d => d.present),
                backgroundColor: 'rgba(34, 197, 94, 0.6)',
            },
            {
                label: 'Absent',
                data: reportData.map(d => d.absent),
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
            },
            {
                label: 'Late',
                data: reportData.map(d => d.late),
                backgroundColor: 'rgba(234, 179, 8, 0.6)',
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Department Attendance Summary',
            },
        },
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-6">Department Attendance Report</h1>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">From Date</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">To Date</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Generating report...</p>
                </div>
            ) : reportData.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Summary Cards */}
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-indigo-500 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Students</div>
                            <div className="text-3xl font-bold text-gray-900">{reportData.reduce((a, b) => a + b.total_students, 0)}</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-green-500 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Present</div>
                            <div className="text-3xl font-bold text-gray-900">{reportData.reduce((a, b) => a + b.present, 0)}</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-red-500 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Absent</div>
                            <div className="text-3xl font-bold text-gray-900">{reportData.reduce((a, b) => a + b.absent, 0)}</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-yellow-500 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Late</div>
                            <div className="text-3xl font-bold text-gray-900">{reportData.reduce((a, b) => a + b.late, 0)}</div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-800">Department Wise Breakdown</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50/80">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Total Students
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Present
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Absent
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Attendance %
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {reportData.map((dept, index) => (
                                        <tr key={index} className="hover:bg-gray-50/50 transition-colors duration-200">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">{dept.department_name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {dept.total_students}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                                                {dept.present}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                                                {dept.absent}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                                {dept.attendance_percentage}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-center">
                        <Bar options={chartOptions} data={chartData} />
                    </div>
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-500 font-medium">No data found for the selected date range.</p>
                </div>
            )}
        </div>
    );
}
