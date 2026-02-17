import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function FeeReports() {
    const [stats, setStats] = useState({
        total_demand: 0,
        total_collected: 0,
        pending_amount: 0,
        collection_rate: 0,
        paid_count: 0,
        partial_count: 0,
        pending_count: 0,
        overdue_count: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/fees/statistics', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch statistics', error);
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: ['Collection'],
        datasets: [
            {
                label: 'Collected',
                data: [stats.total_collected],
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
            {
                label: 'Pending',
                data: [stats.pending_amount],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
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
                text: 'Fee Collection Status',
            },
        },
    };

    if (loading) {
        return <div className="text-center py-8">Loading reports...</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Fee Reports</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-medium">Total Demand</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">₹{stats.total_demand}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm font-medium">Total Collected</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">₹{stats.total_collected}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                    <h3 className="text-gray-500 text-sm font-medium">Pending Amount</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">₹{stats.pending_amount}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                    <h3 className="text-gray-500 text-sm font-medium">Collection Rate</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.collection_rate}%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <Bar options={chartOptions} data={chartData} />
                </div>

                {/* Status Breakdown */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Status Breakdown</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="text-gray-700">Fully Paid</span>
                            <span className="font-bold text-green-600">{stats.paid_count} Students</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="text-gray-700">Partially Paid</span>
                            <span className="font-bold text-yellow-600">{stats.partial_count} Students</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="text-gray-700">Pending</span>
                            <span className="font-bold text-red-600">{stats.pending_count} Students</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="text-gray-700">Overdue</span>
                            <span className="font-bold text-red-800">{stats.overdue_count} Students</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
