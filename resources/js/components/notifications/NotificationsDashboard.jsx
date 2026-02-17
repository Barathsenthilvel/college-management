import React from 'react';
import { Link } from 'react-router-dom';

export default function NotificationsDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Send to All Card */}
                <Link to="/notifications/broadcast" className="block group">
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Send to All</h2>
                        <p className="mt-2 text-gray-600">Broadcast announcements, alerts, or reminders to all students and staff.</p>
                    </div>
                </Link>

                {/* Department-wise Card */}
                <Link to="/notifications/department" className="block group">
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">Department-wise</h2>
                        <p className="mt-2 text-gray-600">Target notifications to specific departments or academic units.</p>
                    </div>
                </Link>

                {/* Individual User Card */}
                <Link to="/notifications/individual" className="block group">
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">Individual User</h2>
                        <p className="mt-2 text-gray-600">Send personalized messages to a specific student or staff member.</p>
                    </div>
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent History</h2>
                <div className="text-gray-500 text-center py-4">
                    No recent notifications sent.
                </div>
            </div>
        </div>
    );
}
