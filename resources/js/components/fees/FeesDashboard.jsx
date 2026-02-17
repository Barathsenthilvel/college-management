import React from 'react';
import { Link } from 'react-router-dom';

export default function FeesDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Fees Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Fee Collection Card */}
                <Link to="/fees/collect" className="block group">
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">Fee Collection</h2>
                        <p className="mt-2 text-gray-600">Collect fees, generate receipts, and manage student payments.</p>
                    </div>
                </Link>

                {/* Pending Fees Card */}
                <Link to="/fees/pending" className="block group">
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-red-600 transition-colors">Pending Fees</h2>
                        <p className="mt-2 text-gray-600">View and follow up on students with outstanding fee balances.</p>
                    </div>
                </Link>

                {/* Fee Reports Card */}
                <Link to="/fees/reports" className="block group">
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">Fee Reports</h2>
                        <p className="mt-2 text-gray-600">Analyze fee collection trends, valid transactions, and financial summaries.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
