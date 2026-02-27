import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SubjectManagement() {
    const [subjects, setSubjects] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Form State
    const [showModal, setShowModal] = useState(false);
    const [programType, setProgramType] = useState('');
    const [subProgramType, setSubProgramType] = useState('');
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
            const [userRes, deptRes, staffRes] = await Promise.all([
                axios.get('/api/user', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/departments', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/staff', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            const user = userRes.data;
            setCurrentUser(user);
            setDepartments(deptRes.data.data || deptRes.data);
            setStaffList(staffRes.data.data || staffRes.data);

            // Auto-assign department for staff
            if (user && user.roles && user.roles.some(r => r.name === 'staff')) {
                setFormData(prev => ({ ...prev, department_id: user.department_id }));
            }
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
            setShowModal(false);
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
        setProgramType('');
        setSubProgramType('');
        setShowModal(true);
    };

    const handleReset = () => {
        setIsEditing(false);
        setCurrentSubjectId(null);
        setProgramType('');
        setSubProgramType('');

        const isStaff = currentUser && currentUser.roles && currentUser.roles.some(r => r.name === 'staff');

        setFormData({
            subject_name: '',
            subject_code: '',
            department_id: isStaff ? currentUser.department_id : '',
            year: '',
            staff_id: '',
            credits: 3,
            status: 'active'
        });
    };

    const openAddModal = () => {
        handleReset();
        setShowModal(true);
    };

    const getFilteredDepartments = () => {
        if (!programType) return departments;
        const pt = programType.toLowerCase();

        return departments.filter(d => {
            if (d.program_type) {
                if (pt === 'arts' && d.program_type === 'arts') return true;
                if (pt === 'engineering' && d.program_type === 'engineering') return true;
                if (pt === 'pg' && d.program_type === 'pg') return true;
                return false;
            }
            // Fallback for older data without program_type
            const name = d.department_name.toLowerCase();
            if (pt === 'arts' && (name.includes('arts') || name.includes('commerce') || name.includes('b.a') || name.includes('b.com') || name.includes('b.sc') || name.includes('bba') || name.includes('science'))) return true;
            if (pt === 'engineering' && (name.includes('engineering') || name.includes('b.e') || name.includes('b.tech') || name.includes('computer') || name.includes('technology'))) return true;
            if (pt === 'pg' && (name.includes('master') || name.includes('m.a') || name.includes('m.sc') || name.includes('m.tech') || name.includes('m.e') || name.includes('mca') || name.includes('mba'))) return true;
            return false;
        });
    };

    const filteredDepartments = getFilteredDepartments();

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Subject Management</h1>
                <button
                    onClick={openAddModal}
                    className="bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Subject Wizard</span>
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/80">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Dept/Year</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Staff</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-12 text-gray-500 font-medium">Loading...</td></tr>
                            ) : subjects.length > 0 ? (
                                subjects.map(subject => (
                                    <tr key={subject.id} className="hover:bg-gray-50/50 transition-colors duration-200 group">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{subject.subject_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 bg-gray-50/50 group-hover:bg-white transition-colors uppercase">{subject.subject_code}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <div className="font-semibold text-gray-800">{subject.department?.department_name}</div>
                                            <div className="text-xs text-center inline-block bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold mt-1">Year {subject.year}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                            {subject.staff ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                                                        {subject.staff.name.charAt(0)}
                                                    </div>
                                                    <span>{subject.staff.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${subject.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                                {subject.status.charAt(0).toUpperCase() + subject.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                            <button onClick={() => handleEdit(subject)} className="text-indigo-600 hover:text-indigo-900 font-semibold p-2 hover:bg-indigo-50 rounded-lg transition-colors duration-200 inline-flex items-center space-x-1">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                                <span>Edit</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-16">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                            <p className="text-lg font-medium text-gray-900">No subjects found</p>
                                            <p className="text-sm">Get started by creating an academic subject.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-8 my-8 transform transition-all">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Subject' : 'Add Subject Wizard'}</h2>
                                <p className="text-sm text-gray-500 mt-1">Configure academic placement and details for the subject.</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-xl hover:bg-gray-100 bg-gray-50"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Step 1: Program, Dept, Semester */}
                            <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
                                <h3 className="text-md font-bold text-indigo-900 flex items-center mb-4">
                                    <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center mr-3 font-extrabold text-sm border border-indigo-200">1</span>
                                    Academic Placement
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-11">
                                    {!currentUser?.roles?.some(r => r.name === 'staff') && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">1. Program Area</label>
                                            <select
                                                className="block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
                                                value={programType}
                                                onChange={(e) => {
                                                    setProgramType(e.target.value);
                                                    setFormData({ ...formData, department_id: '' }); // Reset department on change
                                                }}
                                            >
                                                <option value="">All Programs</option>
                                                <option value="Arts">Arts, Science & Commerce</option>
                                                <option value="Engineering">Engineering & Technology</option>
                                                <option value="PG">Postgraduate (PG)</option>
                                            </select>
                                        </div>
                                    )}

                                    <div className={currentUser?.roles?.some(r => r.name === 'staff') ? 'md:col-span-2' : ''}>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">{currentUser?.roles?.some(r => r.name === 'staff') ? '1.' : '2.'} Program / Department</label>
                                        <select
                                            className={`block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${currentUser?.roles?.some(r => r.name === 'staff') ? 'bg-gray-100 cursor-not-allowed text-gray-600 font-medium' : 'bg-white'}`}
                                            value={formData.department_id}
                                            onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                                            required
                                            disabled={currentUser && currentUser.roles && currentUser.roles.some(r => r.name === 'staff')}
                                        >
                                            <option value="">Select Program</option>
                                            {filteredDepartments.length > 0 ? (
                                                filteredDepartments.map(d => (
                                                    <option key={d.id} value={d.id}>{d.department_name}</option>
                                                ))
                                            ) : (
                                                <option disabled value="">No programs match this area</option>
                                            )}
                                        </select>
                                        {currentUser?.roles?.some(r => r.name === 'staff') && (
                                            <p className="text-xs text-indigo-600 mt-1.5 font-medium">As Staff, you are adding subjects strictly to your assigned program.</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">{currentUser?.roles?.some(r => r.name === 'staff') ? '2.' : '3.'} Academic Year</label>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                                            {[1, 2, 3, 4].map(year => (
                                                <label key={year} className={`cursor-pointer rounded-lg border-2 text-center py-3 transition-all font-bold shadow-sm ${String(formData.year) === String(year) ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300'}`}>
                                                    <input
                                                        type="radio"
                                                        name="year"
                                                        value={year}
                                                        checked={String(formData.year) === String(year)}
                                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                                        className="hidden"
                                                        required
                                                    />
                                                    {year}{year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Details */}
                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="text-md font-bold text-gray-800 flex items-center mb-4">
                                    <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center mr-3 font-extrabold text-sm border border-gray-200">2</span>
                                    Subject Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-11">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Subject Name</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Advanced Mathematics"
                                            className="block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50/50 hover:bg-white text-lg font-medium"
                                            value={formData.subject_name}
                                            onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Subject Code</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. MAT201"
                                            className="block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50/50 hover:bg-white font-mono uppercase font-bold text-gray-700"
                                            value={formData.subject_code}
                                            onChange={(e) => setFormData({ ...formData, subject_code: e.target.value.toUpperCase() })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Assigned Staff (Optional)</label>
                                        <select
                                            className="block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50/50 hover:bg-white"
                                            value={formData.staff_id}
                                            onChange={(e) => setFormData({ ...formData, staff_id: e.target.value })}
                                        >
                                            <option value="">-- Leave Unassigned --</option>
                                            {staffList.filter(s => !formData.department_id || s.department_id === parseInt(formData.department_id)).map(s => (
                                                <option key={s.id} value={s.id}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="md:col-span-2 border-t border-gray-100 pt-5 mt-2">
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.status === 'active'}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })}
                                                className="w-5 h-5 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm font-semibold text-gray-700">Set Subject as Active</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-3.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2"
                                >
                                    <span>{isEditing ? 'Save Changes' : 'Create Subject'}</span>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
