import React from 'react';
import { Link } from 'react-router-dom';

export default function AttendanceDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Attendance Module</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* View / Mark Attendance Card */}
                <Link to="/attendance/view" className="block group">
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">View / Mark Attendance</h2>
                        <p className="mt-2 text-gray-600">Daily attendance tracking for students. Mark present, absent, late, and add remarks.</p>
                    </div>
                </Link>

                {/* Department Report Card */}
                <Link to="/attendance/report" className="block group">
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6m4 6V7m4 10V9M5 21h14a2 2 0 002-2V7.414a2 2 0 00-.586-1.414l-3.414-3.414A2 2 0 0015.586 2H5a2 2 0 00-2 2v15a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Department Reports</h2>
                        <p className="mt-2 text-gray-600">View attendance summaries and statistics by department. Export reports and view charts.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
