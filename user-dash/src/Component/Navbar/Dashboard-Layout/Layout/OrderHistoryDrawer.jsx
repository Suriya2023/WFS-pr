import React from 'react';
import { X, Clock, Package, CheckCircle, TrendingUp, ChevronRight } from 'lucide-react';

const OrderHistoryDrawer = ({ isOpen, onClose, stats }) => {
    const orders = stats?.orders || {};
    const recentActivity = stats?.walletActivity || []; // Reusing this for activity placeholders if needed, or we could fetch recent orders

    if (!isOpen) return null;

    const pendingCount = (orders.total || 0) - (orders.received || 0) - (orders.cancelled || 0);

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Order History</h2>
                        <p className="text-sm text-gray-500">Summary of your shipping activity</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-blue-50 p-4 rounded-2xl">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                                <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Received</p>
                            <p className="text-2xl font-black text-gray-900">{orders.received || 0}</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-2xl">
                            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                                <Clock className="w-5 h-5 text-orange-600" />
                            </div>
                            <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">Pending</p>
                            <p className="text-2xl font-black text-gray-900">{pendingCount}</p>
                        </div>
                    </div>

                    {/* Progress Metrics */}
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> Performance
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1.5 font-bold">
                                    <span className="text-gray-600">Completion Rate</span>
                                    <span className="text-blue-600">
                                        {orders.total > 0 ? Math.round(((orders.received || 0) / orders.total) * 100) : 0}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                                        style={{ width: `${orders.total > 0 ? ((orders.received || 0) / orders.total) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Milestones */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Milestones</h3>
                        <div className="space-y-6 relative">
                            <div className="absolute top-2 bottom-2 left-6 w-0.5 bg-gray-100"></div>

                            <div className="flex items-start gap-4 relative">
                                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center shrink-0 z-10">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900">Total Orders Created</p>
                                    <p className="text-xs text-gray-500">Milestone reached: {orders.total || 0} shipments recorded</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 relative">
                                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center shrink-0 z-10">
                                    <Package className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900">Successfully Received</p>
                                    <p className="text-xs text-gray-500">{orders.received || 0} orders have reached destination</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 pb-24 border-t border-gray-100 bg-gray-50/50">
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200"
                    >
                        Close History
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryDrawer;
