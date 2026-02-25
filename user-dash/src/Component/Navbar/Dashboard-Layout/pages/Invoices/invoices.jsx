import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, FileText, Eye, MoreHorizontal, FileSpreadsheet, ChevronRight, LayoutGrid, List } from 'lucide-react';
import axios from 'axios';

function InvoicesPage() {
    const [activeTab, setActiveTab] = useState('Invoices'); // 'Invoices', 'CSB V', 'Multibox CSBV'
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

    // Mock Fetch Logic
    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            try {
                // In future, this will fetch from API
                // const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/invoices?type=${activeTab}`);
                // setDocuments(response.data);

                // For now, keep it empty to show "No Records" or add sample data if needed
                setDocuments([]);
            } catch (err) {
                console.error("Failed to fetch invoices", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [activeTab]);

    const tabs = ['Invoices', 'CSB V', 'Multibox CSBV'];

    return (
        <div className="p-4 lg:p-8 bg-[#F8FAFC] dark:bg-gray-950 min-h-screen">
            {/* Breadcrumbs & Title */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 font-medium">
                    <span>Documents</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-red-600">Invoices</span>
                </div>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                    Invoices
                </h1>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl mb-8 w-fit border border-gray-200 dark:border-gray-800">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === tab
                                ? 'bg-white dark:bg-gray-800 text-red-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6 items-center justify-between">
                <div className="relative w-full lg:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by invoice code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all text-sm shadow-sm"
                    />
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-bold text-sm shadow-sm">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                    <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-bold text-sm shadow-md shadow-red-100/50">
                        <Download className="w-4 h-4" />
                        Export All
                    </button>
                    <div className="hidden sm:flex border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-3 ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-800 text-red-600' : 'bg-white dark:bg-gray-900 text-gray-400'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-3 ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-800 text-red-600' : 'bg-white dark:bg-gray-900 text-gray-400'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-bold">Fetching your data...</p>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-24 h-24 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center mb-6">
                            <FileText className="w-10 h-10 text-red-400" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">No Records Found</h3>
                        <p className="text-gray-500 max-w-sm mb-8 font-medium">
                            We couldn't find any invoices for "{activeTab}". Once you have transactions, they will appear here automatically.
                        </p>
                        <div className="flex gap-4">
                            <button className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all">
                                Refresh
                            </button>
                            <button className="px-6 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all" onClick={() => setActiveTab('Invoices')}>
                                Show All Invoices
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#FBFCFD] dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-bold border-b border-gray-200 dark:border-gray-800">
                                <tr>
                                    <th className="px-6 py-5 w-12">
                                        <input type="checkbox" className="rounded-md border-gray-300 text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer" />
                                    </th>
                                    <th className="px-6 py-5 uppercase tracking-wider text-[11px]">Invoice Code</th>
                                    <th className="px-6 py-5 uppercase tracking-wider text-[11px]">Date</th>
                                    <th className="px-6 py-5 uppercase tracking-wider text-[11px]">Type</th>
                                    <th className="px-6 py-5 uppercase tracking-wider text-[11px]">Status</th>
                                    <th className="px-6 py-5 uppercase tracking-wider text-[11px]">Amount</th>
                                    <th className="px-6 py-5 text-right uppercase tracking-wider text-[11px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {documents.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <input type="checkbox" className="rounded-md border-gray-300 text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-extrabold text-red-600 dark:text-red-400 hover:underline cursor-pointer">
                                                {doc.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-600 dark:text-gray-300">{doc.date}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-black">
                                                {doc.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 rounded-lg text-xs font-black">
                                                Paid
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-black text-gray-900 dark:text-white">
                                            ₹{doc.amount.toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button title="View Details" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button title="Download PDF" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="mt-6 flex items-center justify-between px-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Showing {documents.length} of {documents.length} records
                </p>
                <div className="flex gap-2">
                    <button disabled className="p-2 text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg cursor-not-allowed">
                        Prev
                    </button>
                    <button disabled className="p-2 text-gray-300 border border-gray-200 dark:border-gray-800 rounded-lg cursor-not-allowed">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InvoicesPage;
