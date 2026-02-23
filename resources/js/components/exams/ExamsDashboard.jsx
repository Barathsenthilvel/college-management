import React from 'react';
import { Link } from 'react-router-dom';

export default function ExamsDashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isStudent = user.role === 'student';

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        {isStudent ? 'My Exams & Marks' : 'Exams Management Hub'}
                    </h1>
                    <p className="mt-2 text-gray-500 font-medium tracking-wide text-sm">
                        {isStudent ? 'View your academic performance and report cards.' : 'Centralized control for subjects, grading, and result generation.'}
                    </p>
                </div>
            </div>

            <div className={`grid grid-cols-1 ${!isStudent ? 'md:grid-cols-3' : 'max-w-xl mx-auto'} gap-8`}>
                {/* Manage Subjects Card */}
                {!isStudent && (
                    <Link to="/exams/subjects" className="block group h-full">
                        <div className="bg-white rounded-3xl p-8 h-full border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-200 transform group-hover:rotate-6 transition-transform">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>

                                <h2 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">Subject Configuration</h2>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">Add, classify, and manage all academic subjects, define degree programs, and assign faculty.</p>

                                <div className="flex items-center text-indigo-600 font-bold text-sm tracking-wide">
                                    <span>Enter Module</span>
                                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Enter Marks Card */}
                {!isStudent && (
                    <Link to="/exams/marks/entry" className="block group h-full">
                        <div className="bg-white rounded-3xl p-8 h-full border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-pink-200 transform group-hover:rotate-6 transition-transform">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>

                                <h2 className="text-xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors mb-2">Marks & Grading Entry</h2>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">Input, review, and finalize academic scores for continuous assessments and end-semester exams.</p>

                                <div className="flex items-center text-pink-600 font-bold text-sm tracking-wide">
                                    <span>Enter Module</span>
                                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Result Reports Card */}
                <Link to="/exams/results" className="block group h-full">
                    <div className="bg-white rounded-3xl p-8 h-full border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-200 transform group-hover:rotate-6 transition-transform">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">Performance & Reports</h2>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
                                {isStudent ? 'Securely access your personalized result sheets and academic progress overviews.' : 'Generate consolidated marksheets, class performance analytics, and official report cards.'}
                            </p>

                            <div className="flex items-center text-emerald-600 font-bold text-sm tracking-wide">
                                <span>{isStudent ? 'View My Results' : 'Enter Module'}</span>
                                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
