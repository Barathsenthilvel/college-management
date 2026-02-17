import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/dashboard/statistics', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!stats) return <div>No data available</div>;

    // Simple professional SVG icons for main menu cards
    const IconWrapper = ({ children, color }) => (
        <div
            className={`flex items-center justify-center w-9 h-9 rounded-md ${color} bg-opacity-10 text-opacity-80`}
        >
            {children}
        </div>
    );

    const DashboardIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
        </svg>
    );

    const DeptIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7h18M5 7V5a2 2 0 012-2h10a2 2 0 012 2v2M5 7v12a1 1 0 001 1h12a1 1 0 001-1V7"
            />
        </svg>
    );

    const UsersIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20v-2a4 4 0 00-3-3.87M9 20v-2a4 4 0 013-3.87m0 0a4 4 0 10-3-7.13 4 4 0 013 7.13zM7 8a4 4 0 11-2.91 6.77"
            />
        </svg>
    );

    const CalendarIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
        </svg>
    );

    const MoneyIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .843-3 2 0 1.105.813 1.733 2.077 1.947L12 12m0 0c1.657 0 3 .843 3 2 0 1.105-.813 1.733-2.077 1.947L12 16m0-4V6m0 10v2m8-4a8 8 0 11-16 0 8 8 0 0116 0z"
            />
        </svg>
    );

    const BellIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1"
            />
        </svg>
    );

    const FileIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.828a2 2 0 00-.586-1.414l-3.414-3.414A2 2 0 0012.586 4H7a2 2 0 00-2 2v13a2 2 0 002 2z"
            />
        </svg>
    );

    const studentsPerDeptData = {
        labels: stats.students_per_department.map((d) => d.department_name),
        datasets: [
            {
                label: 'Students',
                data: stats.students_per_department.map((d) => d.count),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
        ],
    };

    const attendanceData = {
        labels: ['Present', 'Absent'],
        datasets: [
            {
                data: [stats.attendance_percentage, 100 - stats.attendance_percentage],
                backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)'],
            },
        ],
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            {/* Overview cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Total Students → Students module with filters (department, year) */}
                <Link
                    to="/students"
                    className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer block"
                >
                    <h3 className="text-gray-500 text-sm">Total Students</h3>
                    <p className="text-3xl font-bold">{stats.total_students}</p>
                    <p className="mt-2 text-xs text-indigo-600 font-medium">View students list &amp; filters</p>
                </Link>

                {/* Total Staff → Staff module */}
                <Link
                    to="/staff"
                    className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer block"
                >
                    <h3 className="text-gray-500 text-sm">Total Staff</h3>
                    <p className="text-3xl font-bold">{stats.total_staff}</p>
                    <p className="mt-2 text-xs text-indigo-600 font-medium">View staff list &amp; departments</p>
                </Link>

                {/* Fee Collection → Fees dashboard (van / non‑van filters can live there) */}
                <Link
                    to="/fees"
                    className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer block"
                >
                    <h3 className="text-gray-500 text-sm">Fee Collection</h3>
                    <p className="text-3xl font-bold">
                        ₹{Number(stats.total_fees || 0).toLocaleString()}
                    </p>
                    <p className="mt-2 text-xs text-indigo-600 font-medium">View per‑student fees &amp; filters</p>
                </Link>

                {/* Attendance % → Attendance dashboard (status, department, year filters) */}
                <Link
                    to="/attendance"
                    className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer block"
                >
                    <h3 className="text-gray-500 text-sm">Attendance %</h3>
                    <p className="text-3xl font-bold">{stats.attendance_percentage}%</p>
                    <p className="mt-2 text-xs text-indigo-600 font-medium">
                        View attendance records &amp; filters
                    </p>
                </Link>
            </div>

            {/* Main menus (quick navigation for admin) */}
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Main Menus</h2>
                    <span className="text-xs text-gray-500">
                        Quick access to all admin modules
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Dashboard */}
                    <Link
                        to="/dashboard"
                        className="group border border-gray-100 rounded-lg p-4 hover:bg-indigo-50 hover:border-indigo-200 transition-colors flex flex-col justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <IconWrapper color="bg-indigo-500 text-indigo-600">
                                <DashboardIcon />
                            </IconWrapper>
                            <div>
                                <h3 className="font-semibold text-gray-800">Dashboard</h3>
                                <p className="mt-1 text-xs text-gray-500">
                                    Overview cards: students, staff, fee collection, attendance %.
                                </p>
                            </div>
                        </div>
                    </Link>

                    {/* Departments */}
                    <Link
                        to="/departments"
                        className="group border border-gray-100 rounded-lg p-4 hover:bg-indigo-50 hover:border-indigo-200 transition-colors flex flex-col justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <IconWrapper color="bg-blue-500 text-blue-600">
                                <DeptIcon />
                            </IconWrapper>
                            <div>
                                <h3 className="font-semibold text-gray-800">Departments</h3>
                                <p className="mt-1 text-xs text-gray-500">
                                    Add, view, edit and delete departments.
                                </p>
                            </div>
                        </div>
                    </Link>

                    {/* Students */}
                    <Link
                        to="/students"
                        className="group border border-gray-100 rounded-lg p-4 hover:bg-indigo-50 hover:border-indigo-200 transition-colors flex flex-col justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <IconWrapper color="bg-emerald-500 text-emerald-600">
                                <UsersIcon />
                            </IconWrapper>
                            <div>
                                <h3 className="font-semibold text-gray-800">Students</h3>
                                <p className="mt-1 text-xs text-gray-500">
                                    Add students, manage list, profiles, and department-wise filters.
                                </p>
                            </div>
                        </div>
                    </Link>

                    {/* Staff */}
                    <Link
                        to="/staff"
                        className="group border border-gray-100 rounded-lg p-4 hover:bg-indigo-50 hover:border-indigo-200 transition-colors flex flex-col justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <IconWrapper color="bg-sky-500 text-sky-600">
                                <UsersIcon />
                            </IconWrapper>
                            <div>
                                <h3 className="font-semibold text-gray-800">Staff</h3>
                                <p className="mt-1 text-xs text-gray-500">
                                    Add staff, view list and manage roles.
                                </p>
                            </div>
                        </div>
                    </Link>

                    {/* Attendance */}
                    <Link
                        to="/attendance"
                        className="group border border-gray-100 rounded-lg p-4 hover:bg-indigo-50 hover:border-indigo-200 transition-colors flex flex-col justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <IconWrapper color="bg-amber-500 text-amber-600">
                                <CalendarIcon />
                            </IconWrapper>
                            <div>
                                <h3 className="font-semibold text-gray-800">Attendance</h3>
                                <p className="mt-1 text-xs text-gray-500">
                                    View and manage attendance and department-wise reports.
                                </p>
                            </div>
                        </div>
                    </Link>

                    {/* Fees */}
                    <Link
                        to="/fees"
                        className="group border border-gray-100 rounded-lg p-4 hover:bg-indigo-50 hover:border-indigo-200 transition-colors flex flex-col justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <IconWrapper color="bg-rose-500 text-rose-600">
                                <MoneyIcon />
                            </IconWrapper>
                            <div>
                                <h3 className="font-semibold text-gray-800">Fees</h3>
                                <p className="mt-1 text-xs text-gray-500">
                                    Fees collection, pending fees and fee reports.
                                </p>
                            </div>
                        </div>
                    </Link>

                    {/* Notifications */}
                    <Link
                        to="/notifications"
                        className="group border border-gray-100 rounded-lg p-4 hover:bg-indigo-50 hover:border-indigo-200 transition-colors flex flex-col justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <IconWrapper color="bg-violet-500 text-violet-600">
                                <BellIcon />
                            </IconWrapper>
                            <div>
                                <h3 className="font-semibold text-gray-800">Notifications</h3>
                                <p className="mt-1 text-xs text-gray-500">
                                    Send to all, department-wise or individual users.
                                </p>
                            </div>
                        </div>
                    </Link>

                    {/* Leaves */}
                    <Link
                        to="/leaves"
                        className="group border border-gray-100 rounded-lg p-4 hover:bg-indigo-50 hover:border-indigo-200 transition-colors flex flex-col justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <IconWrapper color="bg-slate-500 text-slate-600">
                                <FileIcon />
                            </IconWrapper>
                            <div>
                                <h3 className="font-semibold text-gray-800">Leave Management</h3>
                                <p className="mt-1 text-xs text-gray-500">
                                    Approve / reject leave requests and view leave reports.
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Students per Department</h2>
                    <Bar data={studentsPerDeptData} />
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Attendance Overview</h2>
                    <Doughnut data={attendanceData} />
                </div>
            </div>
        </div>
    );
}

