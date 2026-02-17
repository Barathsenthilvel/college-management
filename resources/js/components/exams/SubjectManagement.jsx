import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SubjectManagement() {
    const [subjects, setSubjects] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [isEditing, setIsEditing] = useState(false);
    const [currentSubjectId, setCurrentSubjectId] = useState(null);
    const [formData, setFormData] = useState({
        subject_name: '',
        subject_code: '',
        department_id: '',
        year: '',
        staff_id: '',
        credits: 3,
        status: 'active'
    });

    useEffect(() => {
        fetchInitialData();
        fetchSubjects();
    }, []);

    const fetchInitialData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [deptRes, staffRes] = await Promise.all([
                axios.get('/api/departments', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/staff', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setDepartments(deptRes.data.data || deptRes.data);
            setStaffList(staffRes.data.data || staffRes.data);
        } catch (error) {
            console.error('Failed to fetch dependency data', error);
        }
    };

    const fetchSubjects = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/subjects', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubjects(response.data);
        } catch (error) {
            console.error('Failed to fetch subjects', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (isEditing) {
                await axios.put(`/api/subjects/${currentSubjectId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Subject updated successfully');
            } else {
                await axios.post('/api/subjects', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Subject added successfully');
            }
            fetchSubjects();
            handleReset();
        } catch (error) {
            console.error('Operation failed', error);
            alert('Failed to save subject. ' + (error.response?.data?.message || ''));
        }
    };

    const handleEdit = (subject) => {
        setIsEditing(true);
        setCurrentSubjectId(subject.id);
        setFormData({
            subject_name: subject.subject_name,
            subject_code: subject.subject_code,
            department_id: subject.department_id,
            year: subject.year || '',
            staff_id: subject.staff_id || '',
            credits: subject.credits,
            status: subject.status
        });
    };

    const handleReset = () => {
        setIsEditing(false);
        setCurrentSubjectId(null);
        setFormData({
            subject_name: '',
            subject_code: '',
            department_id: '',
            year: '',
            staff_id: '',
            credits: 3,
            status: 'active'
        });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Subject Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Subject' : 'Add New Subject'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Subject Name</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.subject_name}
                                    onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Subject Code</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.subject_code}
                                    onChange={(e) => setFormData({ ...formData, subject_code: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Department</label>
                                <select
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.department_id}
                                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>{d.department_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Year</label>
                                <select
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    required
                                >
                                    <option value="">Select Year</option>
                                    {[1, 2, 3, 4].map(y => <option key={y} value={y}>Year {y}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Assigned Staff</label>
                                <select
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.staff_id}
                                    onChange={(e) => setFormData({ ...formData, staff_id: e.target.value })}
                                >
                                    <option value="">None</option>
                                    {staffList.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.department?.department_name})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {isEditing ? 'Update' : 'Save'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dept/Year</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                                    ) : subjects.length > 0 ? (
                                        subjects.map(subject => (
                                            <tr key={subject.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subject.subject_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.subject_code}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.department?.department_name} / Yr {subject.year}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.staff?.name || 'Unassigned'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${subject.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {subject.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button onClick={() => handleEdit(subject)} className="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="6" className="text-center py-4 text-gray-500">No subjects found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
