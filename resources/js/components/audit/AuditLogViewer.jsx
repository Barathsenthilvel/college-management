import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AuditLogViewer() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchLogs(page);
    }, [page]);

    const fetchLogs = async (pageNum) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/audit-logs?page=${pageNum}`);
            setLogs(res.data.data);
            setTotalPages(res.data.last_page);
        } catch (error) {
            console.error('Error fetching audit logs');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Audit Logs</h2>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 border-b">User</th>
                            <th className="p-3 border-b">Action</th>
                            <th className="p-3 border-b">Description</th>
                            <th className="p-3 border-b">IP & Agent</th>
                            <th className="p-3 border-b">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr>
                        ) : logs.length > 0 ? (
                            logs.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="p-3 border-b text-sm font-semibold">
                                        {log.user ? log.user.name : <span className="text-gray-400">System/Guest</span>}
                                        <div className="text-xs text-gray-500">{log.user?.email}</div>
                                    </td>
                                    <td className="p-3 border-b text-sm">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${log.action.includes('DELETE') ? 'bg-red-100 text-red-800' :
                                                log.action.includes('POST') ? 'bg-green-100 text-green-800' :
                                                    log.action.includes('PUT') ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="p-3 border-b text-xs text-gray-600 font-mono w-1/3 truncate max-w-xs" title={log.description}>
                                        {log.description}
                                    </td>
                                    <td className="p-3 border-b text-xs text-gray-500">
                                        <div>{log.ip_address}</div>
                                        <div className="truncate w-32" title={log.user_agent}>{log.user_agent}</div>
                                    </td>
                                    <td className="p-3 border-b text-xs text-gray-500">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="p-4 text-center text-gray-500">No logs found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
