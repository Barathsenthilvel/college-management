import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function PendingFees() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isStudent = user.role === 'student';

    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null); // For handling "Pay Now" modal
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMode, setPaymentMode] = useState('cash');

    useEffect(() => {
        fetchPendingFees();
    }, []);

    const fetchPendingFees = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/fees', {
                params: { status: 'pending' }, // Also need to fetch partial, backend logic for this might need adjustment or multiple calls
                // Let's assume backend filters to include partial if we don't specify strict status, or we update backend to allow multiple statuses
                // For now, let's filter client side or assume API returns all if we ask properly.
                // Actually FeeController index handles single status. 
                // We should probably update backend to allow array of statuses or handle it client side.
                // Quick fix: Fetch all and filter client side for now to be safe, or make 2 requests.
                // Let's make 2 requests for simplicity or modify backend.
                // Modified backend is better but I can't do it right now without context switch.
                // I'll fetch 'pending' and then fetch 'partial'.
                headers: { Authorization: `Bearer ${token}` }
            });

            // We need to fetch partial as well.
            const responsePartial = await axios.get('/api/fees', {
                params: { status: 'partial' },
                headers: { Authorization: `Bearer ${token}` }
            });

            const allFees = [...(response.data.data || []), ...(responsePartial.data.data || [])];
            setFees(allFees);
        } catch (error) {
            console.error('Failed to fetch fees', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePayNow = (fee) => {
        setSelectedPayment(fee);
        const paid = fee.transactions ? fee.transactions.reduce((acc, t) => acc + parseFloat(t.amount), 0) : 0;
        const pending = parseFloat(fee.total_amount) - paid;
        setPaymentAmount(pending); // Default to full pending amount
    };

    const submitPayment = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/fees/${selectedPayment.id}/pay`, {
                amount: paymentAmount,
                payment_mode: paymentMode,
                payment_date: new Date().toISOString().split('T')[0]
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert('Payment successful!');
            setSelectedPayment(null);
            fetchPendingFees();
        } catch (error) {
            alert('Payment failed: ' + (error.response?.data?.error || error.message));
        }
    };

    // Calculate pending amount helper
    const getPendingAmount = (fee) => {
        const paid = fee.transactions ? fee.transactions.reduce((acc, t) => acc + parseFloat(t.amount), 0) : 0;
        return (parseFloat(fee.total_amount) - paid).toFixed(2);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-6">Pending Fees</h1>

            {/* Fees Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/80">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fee Type</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Pending</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Due Date</th>
                                {!isStudent && (
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                            {fees.length > 0 ? fees.map((fee) => (
                                <tr key={fee.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900">{fee.student?.name}</div>
                                        <div className="text-xs text-gray-500 font-medium">{fee.student?.id}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {fee.student?.department?.department_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{fee.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">₹{fee.total_amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-black">
                                        ₹{getPendingAmount(fee)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                        {new Date(fee.due_date).toLocaleDateString()}
                                    </td>
                                    {!isStudent && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handlePayNow(fee)}
                                                className="text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-sm border border-indigo-100 hover:border-transparent"
                                            >
                                                Pay Now
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 font-medium">No pending fees found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pay Now Modal */}
            {selectedPayment && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 transform transition-all">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Make Payment</h2>
                        <div className="mb-6 bg-gray-50 rounded-xl p-5 space-y-2 border border-gray-100">
                            <p className="text-sm font-semibold text-gray-600 flex justify-between">
                                <span>Student:</span> <span className="text-gray-900">{selectedPayment.student?.name}</span>
                            </p>
                            <p className="text-sm font-semibold text-gray-600 flex justify-between">
                                <span>Fee Type:</span> <span className="text-gray-900">{selectedPayment.type}</span>
                            </p>
                            <div className="border-t border-gray-200 mt-3 pt-3">
                                <p className="text-sm font-bold text-gray-700 flex justify-between">
                                    <span>Pending Amount:</span> <span className="text-red-600 text-lg">₹{getPendingAmount(selectedPayment)}</span>
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Amount to Pay</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Mode</label>
                                <select
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    value={paymentMode}
                                    onChange={(e) => setPaymentMode(e.target.value)}
                                >
                                    <option value="cash">Cash</option>
                                    <option value="upi">UPI</option>
                                    <option value="card">Card</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-4">
                            <button
                                onClick={() => setSelectedPayment(null)}
                                className="px-6 py-2.5 text-gray-700 font-semibold bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-sm transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitPayment}
                                className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 transition-all duration-200"
                            >
                                Confirm Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
