// components/OrdersTable.jsx

import React, { useState } from 'react';
import { Plus, Upload, Search, Filter, Download, ChevronRight } from 'lucide-react';


function OrdersTable({
    title = "All Orders",
    breadcrumb = ["Orders", "All"],
    showAddButton = true,
    showBulkButton = true,
    tabs = [],
    tableData = [],
    onAddOrder,
    onBulkOrder,
    onTabChange,
    activeTab = 'all'
}) {
    const [localActiveTab, setLocalActiveTab] = useState(activeTab);
    const [searchQuery, setSearchQuery] = useState('');

    const handleTabChange = (tabId) => {
        setLocalActiveTab(tabId);
        if (onTabChange) onTabChange(tabId);
    };

    // Tab ke according headers return kare
    const getTableHeaders = () => {
        switch (localActiveTab) {
            case 'all':
                return (
                    <>
                        <th className="px-4 py-3 text-left">
                            <input type="checkbox" className="rounded border-gray-300" />
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer Details</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Package Details</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Last Mile Details</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">View Order</th>
                    </>
                );

            case 'draft':
            case 'ready':
            case 'cancelled':
                return (
                    <>
                        <th className="px-4 py-3 text-left">
                            <input type="checkbox" className="rounded border-gray-300" />
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer Details</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Package Details</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </>
                );

            case 'packed':
            case 'manifested':
            case 'dispatched':
            case 'received':
                return (
                    <>
                        <th className="px-4 py-3 text-left">
                            <input type="checkbox" className="rounded border-gray-300" />
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer Details</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Package Details</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Last Mile Details</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </>
                );

            case 'disputed':
                return (
                    <>
                        <th className="px-4 py-3 text-left">
                            <input type="checkbox" className="rounded border-gray-300" />
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer Details</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Package Details</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Last Mile Details</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">View Order</th>
                    </>
                );

            default:
                return null;
        }
    };

    // Columns count for colspan
    const getColumnCount = () => {
        switch (localActiveTab) {
            case 'draft':
            case 'ready':
            case 'cancelled':
                return 7;
            case 'packed':
            case 'manifested':
            case 'dispatched':
            case 'received':
                return 8;
            default:
                return 8;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-4 lg:px-6 py-4">
                    {/* Title and Breadcrumb */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                {breadcrumb.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <span className={index === breadcrumb.length - 1 ? 'text-gray-900' : ''}>
                                            {item}
                                        </span>
                                        {index < breadcrumb.length - 1 && <ChevronRight className="w-4 h-4" />}
                                    </React.Fragment>
                                ))}
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                        </div>
                        <div className="flex gap-3">
                            {showAddButton && (
                                <button
                                    onClick={onAddOrder}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add Order
                                </button>
                            )}
                            {showBulkButton && (
                                <button
                                    onClick={onBulkOrder}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                >
                                    <Upload className="w-5 h-5" />
                                    Bulk Order
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tabs */}
                    {tabs.length > 0 && (
                        <div className="flex gap-6 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`pb-3 px-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${localActiveTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Filters and Search */}
            <div className="px-4 lg:px-6 py-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Enter Tracking Id . . ."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            <Filter className="w-5 h-5" />
                            More Filters
                        </button>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Download className="w-5 h-5" />
                        Export
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="px-4 lg:px-6 pb-6">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    {getTableHeaders()}
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.length === 0 ? (
                                    <tr>
                                        <td colSpan={getColumnCount()} className="px-4 py-24 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <p className="text-gray-500 text-lg">No Records</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    tableData.map((row, index) => (
                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <input type="checkbox" className="rounded border-gray-300" />
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{row.orderId}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{row.customerDetails}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{row.orderDate}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{row.packageDetails}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${row.statusClass}`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                            {(localActiveTab === 'all' || localActiveTab === 'packed' || localActiveTab === 'manifested' ||
                                                localActiveTab === 'dispatched' || localActiveTab === 'received' || localActiveTab === 'disputed') && (
                                                    <td className="px-4 py-3 text-sm text-gray-900">{row.lastMileDetails}</td>
                                                )}
                                            <td className="px-4 py-3">
                                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                    {localActiveTab === 'all' || localActiveTab === 'disputed' ? 'View' : 'Actions'}
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
        </div>
    );
}

export default OrdersTable;