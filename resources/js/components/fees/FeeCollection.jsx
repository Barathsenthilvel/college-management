import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function FeeCollection() {
    const [departments, setDepartments] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');

    // Fee Form State
    const [feeType, setFeeType] = useState('Tuition');
    const [totalAmount, setTotalAmount] = useState('');
    const [paidAmount, setPaidAmount] = useState('');
    const [paymentMode, setPaymentMode] = useState('cash');
    const [transactionRef, setTransactionRef] = useState('');
    const [remarks, setRemarks] = useState('');
    const [dueDate, setDueDate] = useState('');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (selectedDepartment) {
            fetchStudents();
        } else {
            setStudents([]);
        }
    }, [selectedDepartment]);

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/departments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDepartments(response.data.data || response.data);
        } catch (error) {
            console.error('Failed to fetch departments', error);
        }
    };

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/students', {
                params: { department_id: selectedDepartment },
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(response.data.data || response.data);
        } catch (error) {
            console.error('Failed to fetch students', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('token');
            const payload = {
                student_id: selectedStudent,
                total_amount: totalAmount,
                type: feeType,
                due_date: dueDate,
                paid_amount: paidAmount,
                payment_mode: paidAmount > 0 ? paymentMode : null,
                transaction_ref: transactionRef,
                payment_date: new Date().toISOString().split('T')[0],
                remarks: remarks
            };

            await axios.post('/api/fees', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage({ type: 'success', text: 'Fee collected successfully!' });
            // Reset form
            setTotalAmount('');
            setPaidAmount('');
            setTransactionRef('');
            setRemarks('');
        } catch (error) {
            console.error('Failed to collect fee', error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to collect fee.' });
        } finally {
            setLoading(false);
        }
    };

    const balanceAmount = (parseFloat(totalAmount) || 0) - (parseFloat(paidAmount) || 0);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-6">Fee Collection</h1>

            {message.text && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">

                {/* Student Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                        <select
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map(d => (
                                <option key={d.id} value={d.id}>{d.department_name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Student</label>
                        <select
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50/50 hover:bg-white disabled:opacity-50 disabled:bg-gray-100"
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            required
                            disabled={!selectedDepartment}
                        >
                            <option value="">Select Student</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Fee Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Fee Type</label>
                            <select
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                                value={feeType}
                                onChange={(e) => setFeeType(e.target.value)}
                            >
                                <option value="Tuition">Tuition Fee</option>
                                <option value="Transport">Transport Fee</option>
                                <option value="Hostel">Hostel Fee</option>
                                <option value="Exam">Exam Fee</option>
                                <option value="Library">Library Fee</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Total Amount</label>
                            <input
                                type="number"
                                min="0"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                                value={totalAmount}
                                onChange={(e) => setTotalAmount(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Paid Amount</label>
                            <input
                                type="number"
                                min="0"
                                max={totalAmount}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                                value={paidAmount}
                                onChange={(e) => setPaidAmount(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Mode</label>
                            <select
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50/50 hover:bg-white disabled:opacity-50 disabled:bg-gray-100"
                                value={paymentMode}
                                onChange={(e) => setPaymentMode(e.target.value)}
                                disabled={!paidAmount || parseFloat(paidAmount) === 0}
                            >
                                <option value="cash">Cash</option>
                                <option value="upi">UPI</option>
                                <option value="card">Card</option>
                                <option value="bank_transfer">Bank Transfer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Transaction Ref (Optional)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50/50 hover:bg-white disabled:opacity-50 disabled:bg-gray-100"
                                value={transactionRef}
                                onChange={(e) => setTransactionRef(e.target.value)}
                                disabled={!paidAmount || parseFloat(paidAmount) === 0}
                            />
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50/80 border border-gray-100 rounded-xl flex justify-between items-center shadow-sm">
                        <span className="font-bold text-gray-700">Balance Amount:</span>
                        <span className={`text-xl font-black ${balanceAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ₹{balanceAmount.toFixed(2)}
                        </span>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Remarks</label>
                        <textarea
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            rows="2"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                <div className="flex justify-end pt-4 space-x-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => {
                            setTotalAmount('');
                            setPaidAmount('');
                            setTransactionRef('');
                            setRemarks('');
                        }}
                        className="px-6 py-2.5 text-gray-700 font-semibold bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-sm transition-all duration-200"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 transition-all duration-200"
                    >
                        {loading ? 'Processing...' : 'Collect Fee'}
                    </button>
                </div>
            </form>
        </div>
    );
}
