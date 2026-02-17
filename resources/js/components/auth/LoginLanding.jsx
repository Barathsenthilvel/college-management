import React from 'react';
import { Link } from 'react-router-dom';

export default function LoginLanding() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                        College Management System
                    </h1>
                    <p className="text-xl text-gray-600">
                        Please select your login type
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Student Login Card */}
                    <Link
                        to="/student/login"
                        className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-2 border-blue-200 hover:border-blue-400"
                    >
                        <div className="text-center">
                            <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Student</h3>
                            <p className="text-gray-600 mb-4">Access your student portal</p>
                            <span className="text-blue-600 font-semibold">Login as Student →</span>
                        </div>
                    </Link>

                    {/* Staff Login Card */}
                    <Link
                        to="/staff/login"
                        className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-2 border-green-200 hover:border-green-400"
                    >
                        <div className="text-center">
                            <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Staff</h3>
                            <p className="text-gray-600 mb-4">Access staff dashboard</p>
                            <span className="text-green-600 font-semibold">Login as Staff →</span>
                        </div>
                    </Link>

                    {/* Admin Login Card */}
                    <Link
                        to="/admin/login"
                        className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-2 border-purple-200 hover:border-purple-400"
                    >
                        <div className="text-center">
                            <div className="bg-purple-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Admin</h3>
                            <p className="text-gray-600 mb-4">Access admin panel</p>
                            <span className="text-purple-600 font-semibold">Login as Admin →</span>
                        </div>
                    </Link>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Select the appropriate login option based on your role</p>
                </div>
            </div>
        </div>
    );
}

