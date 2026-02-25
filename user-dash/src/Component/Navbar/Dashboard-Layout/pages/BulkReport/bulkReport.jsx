import React, { useState, useEffect } from 'react';
import { Download, FileText, CheckCircle, AlertCircle, Trash2, Eye, Filter, Loader, Calendar, Layers, Search, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

function BulkReportPage() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/reports/list`, config);
            setReports(data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(reports.map(r => r.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const filteredReports = reports.filter(r =>
        r.jobType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.date.includes(searchTerm)
    );

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">Bulk Reports</h1>
                    <p className="text-gray-500 font-bold text-sm">Download processed shipping data and monthly performance logs.</p>
                </div>

                <div className="flex bg-gray-100 p-1.5 rounded-2xl w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search reports..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 bg-white border-transparent rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-red-500 transition-all placeholder:text-gray-300 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto overflow-y-visible">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded-lg border-2 border-gray-200 text-red-600 focus:ring-red-500 transition-all cursor-pointer"
                                            onChange={handleSelectAll}
                                            checked={reports.length > 0 && selectedItems.length === reports.length}
                                        />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select All</span>
                                    </div>
                                </th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Generation Date</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Job Name / Type</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Records</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader className="w-10 h-10 animate-spin text-red-600" />
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Retrieving Cloud Data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredReports.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mb-6">
                                                <Layers className="w-10 h-10 text-gray-200" />
                                            </div>
                                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">No Reports Available</h3>
                                            <p className="text-gray-400 font-bold text-xs uppercase tracking-wider max-w-xs mx-auto">
                                                Generated shipping reports will appear here for download.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredReports.map((report) => (
                                    <tr key={report.id} className="group hover:bg-gray-50/50 transition-all">
                                        <td className="px-8 py-6">
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded-lg border-2 border-gray-200 text-red-600 focus:ring-red-500 transition-all cursor-pointer"
                                                checked={selectedItems.includes(report.id)}
                                                onChange={() => handleSelectItem(report.id)}
                                            />
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-red-50 text-red-600 rounded-xl"><Calendar className="w-4 h-4" /></div>
                                                <span className="text-sm font-black text-gray-800">{report.date}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-gray-900 group-hover:text-red-700 transition-colors uppercase tracking-tight">{report.jobType}</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">System Generated Log</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-black text-gray-900 shadow-sm">{report.totalRecords}</span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase border-2 shadow-sm ${report.status === 'Completed'
                                                    ? 'bg-green-50 text-green-600 border-green-100'
                                                    : report.status === 'Processing'
                                                        ? 'bg-blue-50 text-blue-800 border-blue-100'
                                                        : 'bg-red-50 text-red-800 border-red-100'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${report.status === 'Completed' ? 'bg-green-600' : 'bg-red-600'} animate-pulse`} />
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-black hover:text-white transition-all shadow-sm">
                                                    <Download className="w-5 h-5" />
                                                </button>
                                                <button className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {reports.length > 0 && (
                    <div className="p-8 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing {filteredReports.length} of {reports.length} generated reports</p>
                        <div className="flex gap-2">
                            <button className="px-6 py-3 bg-white border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-all">Bulk Export</button>
                            <button className="px-6 py-3 bg-gray-900 text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gray-200 hover:bg-black transition-all">Download Selected</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BulkReportPage;
