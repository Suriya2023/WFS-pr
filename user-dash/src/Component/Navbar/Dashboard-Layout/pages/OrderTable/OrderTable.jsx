import React from 'react';
import { XCircle, CheckCircle, Download, FileText, Package, Search, CreditCard } from 'lucide-react';

export const OrderTable = ({
    activeTab,
    Search,
    Plus,
    Upload,
    Filter,
    Download,

    data = [],
    tableConfig = {
        orderIdLabel: 'Order ID',
        customerLabel: 'Customer Details',
        dateLabel: 'Order Date',
        packageLabel: 'Package Details',
        statusLabel: 'Status',
        lastMileLabel: 'Last Mile Details',
        viewLabel: 'View Order',
        actionsLabel: 'Actions'
    },
    onSearch,
    onFilter,
    onExport,
    onViewOrder,
    onEditOrder,
    onAddOrder,
    onDownloadTemplate,
    onImportClick,
    onPayNow,
    onDownloadInvoice,
    onCancelShipment,
    onDownloadPOD,
    onDownloadLabel,
    onDownloadCommercialInvoice,
    importing,
    searchPlaceholder = "Enter Tracking Id . . ."
}) => {

    const getTableHeaders = () => {
        const { orderIdLabel, customerLabel, dateLabel, packageLabel, statusLabel, lastMileLabel, viewLabel, actionsLabel } = tableConfig;

        const baseHeaders = (
            <>
                <th className="px-4 py-3 text-left">
                    <input type="checkbox" className="rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700 focus:ring-blue-500" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{orderIdLabel}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{customerLabel}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{dateLabel}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{packageLabel}</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{statusLabel}</th>
            </>
        );

        switch (activeTab) {
            case 'all':
            case 'disputed':
                return (
                    <>
                        {baseHeaders}
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{lastMileLabel}</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{viewLabel}</th>
                    </>
                );

            case 'draft':
            case 'ready':
            case 'cancelled':
                return (
                    <>
                        {baseHeaders}
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{actionsLabel}</th>
                    </>
                );

            case 'packed':
            case 'manifested':
            case 'dispatched':
            case 'received':
                return (
                    <>
                        {baseHeaders}
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{lastMileLabel}</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">{actionsLabel}</th>
                    </>
                );

            default:
                return baseHeaders;
        }
    };

    const getColumnCount = () => {
        switch (activeTab) {
            case 'all':
            case 'disputed':
            case 'packed':
            case 'manifested':
            case 'dispatched':
            case 'received':
                return 8;
            case 'draft':
            case 'ready':
            case 'cancelled':
                return 7;
            default:
                return 7;
        }
    };

    return (
        <>
            {/* Filters Section */}
            <div className="px-4 lg:px-6 py-4">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 sm:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                onChange={onSearch}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={onFilter}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                <Filter className="w-5 h-5" />
                                More Filters
                            </button>
                            <button
                                onClick={onExport}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                <Download className="w-5 h-5" />
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons Integrated */}
                    <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-start lg:justify-end">
                        {onDownloadTemplate && (
                            <button
                                onClick={onDownloadTemplate}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium transition-colors text-sm"
                            >
                                <Download className="w-4 h-4" />
                                Template
                            </button>
                        )}

                        {onImportClick && (
                            <button
                                onClick={onImportClick}
                                disabled={importing}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium disabled:opacity-50 text-sm border border-blue-200"
                            >
                                {importing ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                ) : (
                                    <Upload className="w-4 h-4" />
                                )}
                                {importing ? 'Importing...' : 'Import Excel'}
                            </button>
                        )}

                        {onAddOrder && (
                            <button
                                onClick={onAddOrder}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Create Order
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="px-4 lg:px-6 pb-6">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden dark:bg-gray-900 dark:border-gray-800 transition-colors duration-200">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                                <tr>{getTableHeaders()}</tr>
                            </thead>
                            <tbody>
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan={getColumnCount()} className="px-6 py-32 text-center">
                                            <div className="flex flex-col items-center justify-center animate-fadeIn">
                                                <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-6 relative">
                                                    <Package className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                                                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 p-1.5 rounded-full shadow-sm">
                                                        <Search className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-wider mb-2">No shipments found</h3>
                                                <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto text-sm font-medium">
                                                    We couldn't find any orders in <span className="text-blue-600 font-bold uppercase">{activeTab}</span>.
                                                    Try adjusting your filters or create a new order.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((order, index) => (
                                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="px-4 py-3">
                                                <input type="checkbox" className="rounded border-gray-300 dark:bg-gray-800 dark:border-gray-700" />
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{order.orderId}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{order.customer}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{order.date}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{order.package}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.15em] rounded-full border transition-all duration-300 flex items-center w-fit gap-2 ${order.status === 'pending_payment' || order.status === 'payment_pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                        order.status === 'paid' || order.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' :
                                                            order.status === 'dispatched' || order.status === 'in_transit' ? 'bg-blue-50 text-blue-600 border-blue-100 shadow-[0_0_12px_rgba(59,130,246,0.1)]' :
                                                                order.status === 'draft' ? 'bg-slate-50 text-slate-500 border-slate-100' :
                                                                    'bg-slate-50 text-slate-700 border-slate-200'
                                                    }`}>
                                                    {(order.status === 'dispatched' || order.status === 'in_transit') && (
                                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                                                    )}
                                                    {order.status === 'pending_payment' ? 'Pending Amount' : order.status?.replace('_', ' ')}
                                                </span>
                                            </td>
                                            {(activeTab === 'all' || activeTab === 'disputed' ||
                                                activeTab === 'packed' || activeTab === 'manifested' ||
                                                activeTab === 'dispatched' || activeTab === 'received') && (
                                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                                        {order.lastMile || '-'}
                                                    </td>
                                                )}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {/* Pay Now Button - Visible for pending_payment status */}
                                                    {(order.status === 'pending_payment' || order.status === 'payment_pending') && onPayNow && (
                                                        <button
                                                            onClick={() => onPayNow(order._id || order.orderId)}
                                                            className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all shadow-sm active:scale-95 border border-green-100/50 flex items-center gap-2"
                                                        >
                                                            <CreditCard className="w-3.5 h-3.5" />
                                                            Pay Now
                                                        </button>
                                                    )}

                                                    {/* Edit Button - Visible until admin verifies (draft or paid) */}
                                                    {(order.status === 'draft' || order.status === 'payment_pending' || order.status === 'paid') ? (
                                                        <button
                                                            onClick={() => onEditOrder && onEditOrder(order._id || order.orderId)}
                                                            className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-sm active:scale-95 border border-orange-100/50"
                                                        >
                                                            Edit
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => onViewOrder && onViewOrder(order._id || order.orderId)}
                                                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 border border-blue-100/50"
                                                        >
                                                            View
                                                        </button>
                                                    )}

                                                    {/* Action Dropdown or Icons for Documents */}
                                                    <div className="flex items-center gap-1">
                                                        {/* Label */}
                                                        {(order.status === 'ready' || order.status === 'manifested' || order.status === 'dispatched' || order.status === 'delivered') && onDownloadLabel && (
                                                            <button
                                                                onClick={() => onDownloadLabel(order._id || order.orderId)}
                                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                                title="Download Label"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        {/* Invoice */}
                                                        {(order.status === 'paid' || order.status === 'ready' || order.status === 'manifested' || order.status === 'dispatched' || order.status === 'delivered') && onDownloadInvoice && (
                                                            <button
                                                                onClick={() => onDownloadInvoice(order._id || order.orderId)}
                                                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                                                title="Download Invoice"
                                                            >
                                                                <FileText className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        {/* Commercial Invoice */}
                                                        {order.isInternational && onDownloadCommercialInvoice && (
                                                            <button
                                                                onClick={() => onDownloadCommercialInvoice(order._id || order.orderId)}
                                                                className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                                                                title="Commercial Invoice"
                                                            >
                                                                <FileText className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        {/* POD */}
                                                        {order.status === 'delivered' && onDownloadPOD && (
                                                            <button
                                                                onClick={() => onDownloadPOD(order._id || order.orderId)}
                                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"
                                                                title="Download POD"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </button>
                                                        )}

                                                        {/* Cancel Button - Only for early stages */}
                                                        {(order.status === 'paid' || order.status === 'ready' || order.status === 'manifested') && onCancelShipment && (
                                                            <button
                                                                onClick={() => onCancelShipment(order._id || order.orderId)}
                                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                                title="Cancel Shipment"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};