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
            <h1 className="text-3xl font-bold text-gray-900">Fee Collection</h1>

            {message.text && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">

                {/* Student Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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

                <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Fee Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Fee Type</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
                            <input
                                type="number"
                                min="0"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={totalAmount}
                                onChange={(e) => setTotalAmount(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Paid Amount</label>
                            <input
                                type="number"
                                min="0"
                                max={totalAmount}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={paidAmount}
                                onChange={(e) => setPaidAmount(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                            <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Ref (Optional)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                value={transactionRef}
                                onChange={(e) => setTransactionRef(e.target.value)}
                                disabled={!paidAmount || parseFloat(paidAmount) === 0}
                            />
                        </div>
                    </div>

                    <div className="mt-4 p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                        <span className="font-semibold text-gray-700">Balance Amount:</span>
                        <span className={`text-xl font-bold ${balanceAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ₹{balanceAmount.toFixed(2)}
                        </span>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                        <textarea
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            rows="2"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        ></textarea>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="button"
                        onClick={() => {
                            setTotalAmount('');
                            setPaidAmount('');
                            setTransactionRef('');
                            setRemarks('');
                        }}
                        className="mr-4 px-6 py-2 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
                    >
                        {loading ? 'Processing...' : 'Collect Fee'}
                    </button>
                </div>
            </form>
        </div>
    );
}
