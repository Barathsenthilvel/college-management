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
            <h1 className="text-3xl font-bold text-gray-900">Department Attendance Report</h1>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                    <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-indigo-500">
                            <div className="text-sm text-gray-500">Total Students Tracked</div>
                            <div className="text-2xl font-bold">{reportData.reduce((a, b) => a + b.total_students, 0)}</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                            <div className="text-sm text-gray-500">Total Present</div>
                            <div className="text-2xl font-bold">{reportData.reduce((a, b) => a + b.present, 0)}</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                            <div className="text-sm text-gray-500">Total Absent</div>
                            <div className="text-2xl font-bold">{reportData.reduce((a, b) => a + b.absent, 0)}</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                            <div className="text-sm text-gray-500">Total Late</div>
                            <div className="text-2xl font-bold">{reportData.reduce((a, b) => a + b.late, 0)}</div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">Department Wise Breakdown</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Students
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Present
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Absent
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Attendance %
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reportData.map((dept, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{dept.department_name}</div>
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
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <Bar options={chartOptions} data={chartData} />
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500">No data found for the selected date range.</p>
                </div>
            )}
        </div>
    );
}
