import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';

export default function IdCardGenerator() {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const componentRef = useRef();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await axios.get('/api/students'); // Assuming this endpoint exists and returns all students
            // If the endpoint is paginated, we might need a search feature instead
            setStudents(res.data.data || res.data);
        } catch (error) {
            console.error('Error fetching students');
        }
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">ID Card Generator</h2>

            <div className="flex space-x-6">
                {/* Student Selection */}
                <div className="w-1/3 bg-white rounded shadow p-4">
                    <h3 className="font-bold mb-4">Select Student</h3>
                    <input
                        type="text"
                        placeholder="Search student..."
                        className="w-full mb-4 p-2 border rounded"
                        onChange={(e) => {
                            // Implement client-side filtering or server-side search here
                            // For now, simple client-side filter could be added
                        }}
                    />
                    <ul className="space-y-2 max-h-96 overflow-y-auto">
                        {students.map(student => (
                            <li
                                key={student.id}
                                onClick={() => setSelectedStudent(student)}
                                className={`p-2 rounded cursor-pointer border ${selectedStudent?.id === student.id ? 'bg-indigo-50 border-indigo-500' : 'hover:bg-gray-50 border-gray-200'}`}
                            >
                                <div className="font-semibold">{student.first_name} {student.last_name}</div>
                                <div className="text-xs text-gray-500">{student.admission_number} | {student.department?.department_name}</div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ID Card Preview */}
                <div className="w-2/3 flex flex-col items-center justify-center bg-gray-100 rounded p-8">
                    {selectedStudent ? (
                        <>
                            <div className="mb-4">
                                <button onClick={handlePrint} className="bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-indigo-700">
                                    Print ID Card
                                </button>
                            </div>

                            <div ref={componentRef} className="bg-white w-[350px] h-[550px] border shadow-lg relative print:shadow-none overflow-hidden">
                                {/* Header / Design */}
                                <div className="bg-indigo-900 h-24 w-full absolute top-0 left-0"></div>
                                <div className="bg-indigo-800 h-24 w-full absolute top-0 left-0 rounded-b-[50%] scale-x-150"></div>

                                <div className="relative z-10 flex flex-col items-center pt-8">
                                    <h1 className="text-white font-bold text-xl tracking-wider">COLLEGE NAME</h1>
                                    <p className="text-indigo-200 text-xs uppercase tracking-widest mb-6">Identity Card</p>

                                    {/* Photo */}
                                    <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow mb-4">
                                        <img
                                            src={selectedStudent.profile_picture ? `/storage/${selectedStudent.profile_picture}` : 'https://via.placeholder.com/150'}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-800 uppercase text-center px-4">
                                        {selectedStudent.first_name} {selectedStudent.last_name}
                                    </h2>
                                    <p className="text-indigo-600 font-semibold mb-6">{selectedStudent.department?.department_name}</p>

                                    <div className="w-full px-8 space-y-3 text-sm">
                                        <div className="flex justify-between border-b border-gray-100 pb-1">
                                            <span className="text-gray-500">ID No:</span>
                                            <span className="font-semibold">{selectedStudent.admission_number}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-100 pb-1">
                                            <span className="text-gray-500">DOB:</span>
                                            <span className="font-semibold">{selectedStudent.dob}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-100 pb-1">
                                            <span className="text-gray-500">Blood Group:</span>
                                            <span className="font-semibold">{selectedStudent.blood_group || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-100 pb-1">
                                            <span className="text-gray-500">Contact:</span>
                                            <span className="font-semibold">{selectedStudent.phone_number}</span>
                                        </div>
                                    </div>

                                    {/* Barcode/QR Code Placeholder */}
                                    <div className="mt-8 bg-black h-12 w-48"></div>

                                    {/* Footer */}
                                    <div className="absolute bottom-4 w-full text-center">
                                        <p className="text-xs text-gray-400">Principal Signature</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-gray-400 text-lg">Select a student to generate ID card</div>
                    )}
                </div>
            </div>
        </div>
    );
}
