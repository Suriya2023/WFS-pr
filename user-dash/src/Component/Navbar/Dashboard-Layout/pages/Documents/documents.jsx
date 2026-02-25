import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, FileText, Eye, MoreHorizontal, FileSpreadsheet } from 'lucide-react';
import axios from 'axios';

function DocumentsPage() {
    const [activeTab, setActiveTab] = useState('invoices'); // 'invoices', 'csbv', 'multibox'
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);

    // Mock Fetch
    useEffect(() => {
        // fetchDocuments();
    }, [activeTab]);

    return (
        <div className="p-4 lg:p-6 bg-gray-50 dark:bg-gray-950 min-h-full">
            {/* Header Section */}


            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
                <div className="flex gap-8 overflow-x-auto">
                    {['Invoices', 'CSB V', 'Multibox CSBV'].map((tab) => {
                        const tabKey = tab.toLowerCase().replace(' ', '');
                        return (
                            <button
                                key={tabKey}
                                onClick={() => setActiveTab(tabKey)}
                                className={`pb-3 text-sm font-semibold transition-colors whitespace-nowrap relative ${activeTab === tabKey
                                    ? 'text-gray-900 dark:text-white border-b-2 border-black dark:border-white'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                {tab}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Enter Invoice Code ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                            />
                        </div>
                        <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium">
                            <Filter className="w-4 h-4" />
                            More Filters
                        </button>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors">
                            <FileSpreadsheet className="w-4 h-4" />
                            Bulk Invoice
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4 w-12">
                                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                </th>
                                <th className="px-6 py-4">Invoice code</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Company</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">GST</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        Loading documents...
                                    </td>
                                </tr>
                            ) : documents.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-32 text-center text-gray-500">
                                        No Records
                                    </td>
                                </tr>
                            ) : (
                                documents.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4"><input type="checkbox" className="rounded" /></td>
                                        <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">{doc.code}</td>
                                        <td className="px-6 py-4">{doc.date}</td>
                                        <td className="px-6 py-4">{doc.company}</td>
                                        <td className="px-6 py-4">{doc.customer}</td>
                                        <td className="px-6 py-4">{doc.gst}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DocumentsPage;
