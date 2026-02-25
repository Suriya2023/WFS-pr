import React from 'react'
import { Package, Truck, Plus, FileText, Wallet, CheckCircle, AlertTriangle, ChevronRight, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import KYCForm from '../KYC/KYCForm'

function mainDash({ setActiveRoute, setOrdersTab, stats }) {
    const orders = stats?.orders || {};
    const walletBalance = stats?.user?.walletBalance || 0;

    const handleStatsClick = (tabId) => {
        if (setOrdersTab) setOrdersTab(tabId);
        setActiveRoute('orders');
    };

    const [showKYCForm, setShowKYCForm] = React.useState(false);

    return (
        <div className="p-6 lg:p-12 min-h-screen bg-[#FCF8F8] animate-in fade-in duration-700">
            {showKYCForm && (
                <KYCForm
                    onClose={() => setShowKYCForm(false)}
                    onSuccess={() => {
                        setShowKYCForm(false);
                    }}
                />
            )}

            <div className="max-w-[1600px] mx-auto space-y-10">
                {/* KYC Header Status */}
                <div className={`rounded-[32px] p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm border transition-all duration-500 ${stats?.user?.kycStatus === 'verified'
                    ? 'bg-white border-green-100 hover:shadow-xl hover:shadow-green-500/5'
                    : stats?.user?.kycStatus === 'pending'
                        ? 'bg-blue-50/50 border-blue-200'
                        : 'bg-white border-red-100 hover:shadow-xl hover:shadow-red-500/5'
                    }`}>
                    <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${stats?.user?.kycStatus === 'verified' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600 animate-pulse'
                            }`}>
                            {stats?.user?.kycStatus === 'verified' ? <CheckCircle className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">System Access Status</h2>
                            <p className="text-gray-500 font-medium mt-1">
                                {stats?.user?.kycStatus === 'verified'
                                    ? "Protocols verified. Your account is fully operational."
                                    : stats?.user?.kycStatus === 'pending'
                                        ? "Security audit in progress. Estimated time: 2-4 hours."
                                        : "KYC credentials required to unlock dispatch modules."}
                            </p>
                        </div>
                    </div>
                    <div>
                        {stats?.user?.kycStatus === 'verified' ? (
                            <div className="px-8 py-3 bg-green-50 text-green-700 border border-green-200 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                VERIFIED <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowKYCForm(true)}
                                className="px-10 py-4 bg-[#E31E24] text-white rounded-2xl hover:bg-red-700 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-red-200 transition-all transform active:scale-95"
                            >
                                {stats?.user?.kycStatus === 'pending' ? "Check Audit Status" : "INITIATE KYC PROTOCOL"}
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats Matrix */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                    <DashboardStatCard icon={<Package className="text-blue-600" />} label="Total Inventory" count={orders.total || 0} color="blue" onClick={() => handleStatsClick('all')} />
                    <DashboardStatCard icon={<FileText className="text-orange-600" />} label="Hold/Drafts" count={orders.draft || 0} color="orange" onClick={() => handleStatsClick('draft')} />
                    <DashboardStatCard icon={<CheckCircle className="text-emerald-600" />} label="Confirmed" count={orders.ready || 0} color="green" onClick={() => handleStatsClick('ready')} />
                    <DashboardStatCard icon={<Package className="text-red-500" />} label="Packed & Sec" count={orders.packed || 0} color="red" onClick={() => handleStatsClick('packed')} />
                    <DashboardStatCard icon={<TrendingUp className="text-purple-600" />} label="In Transit" count={orders.dispatched || 0} color="purple" onClick={() => handleStatsClick('dispatched')} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-gray-950 tracking-tight flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-[#E31E24] rounded-full" /> Operational Modules
                            </h3>
                            <button onClick={() => setActiveRoute('orders')} className="text-[10px] font-black text-[#E31E24] uppercase tracking-[0.3em] hover:underline">View Intelligence Hub</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <ActionBoxSimple icon={<Truck className="w-6 h-6" />} label="Manage Pickups" count={orders.manifested || 0} onClick={() => handleStatsClick('manifested')} />
                            <ActionBoxSimple icon={<FileText className="w-6 h-6" />} label="View Manifests" count={orders.manifested || 0} onClick={() => setActiveRoute('manifests')} />
                            <ActionBoxSimple icon={<AlertTriangle className="w-6 h-6 text-red-500" />} label="Active Disputes" count={orders.disputed || 0} onClick={() => handleStatsClick('disputed')} />
                        </div>
                    </div>

                    {/* Wallet Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-1.5 h-8 bg-amber-400 rounded-full" />
                            <h3 className="text-xl font-black text-gray-950 tracking-tight">Wallet Analytics</h3>
                        </div>
                        <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-700 group">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Liquid Balance</p>
                                    <p className="text-5xl font-black text-gray-950 tracking-tighter">₹{Math.round(walletBalance).toLocaleString('en-IN')}</p>
                                </div>
                                <div className="w-16 h-16 bg-amber-50 rounded-[24px] flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                                    <Wallet className="w-8 h-8 text-amber-500" />
                                </div>
                            </div>

                            <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar mb-10">
                                {stats?.walletActivity && stats.walletActivity.length > 0 ? (
                                    stats.walletActivity.map((txn, index) => (
                                        <div key={txn._id || index} className="flex gap-4 relative">
                                            <div className={`w-3.5 h-3.5 rounded-full ${txn.type === 'credit' ? 'bg-emerald-500' : 'bg-[#E31E24]'} mt-1.5 shrink-0 z-10 border-2 border-white shadow-sm`}></div>
                                            <div className="flex-1 pb-6 group-last:pb-0 border-b border-gray-50 last:border-none">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 leading-none mb-1.5 uppercase tracking-tight">
                                                            {txn.description || (txn.type === 'credit' ? 'Recharge' : 'Deduction')}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                            {new Date(txn.createdAt).toLocaleDateString('en-GB')} • {new Date(txn.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                    <span className={`text-sm font-black tracking-tight ${txn.type === 'credit' ? 'text-emerald-600' : 'text-[#E31E24]'}`}>
                                                        {txn.type === 'credit' ? '+' : '-'}₹{Math.round(txn.amount).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 opacity-40">
                                            <Clock className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <p className="text-xs font-bold text-gray-300 uppercase tracking-[0.2em]">No Recent Activity</p>
                                    </div>
                                )}
                            </div>

                            <button onClick={() => setActiveRoute('wallet')} className="w-full py-5 bg-[#FFD700] text-[#E31E24] rounded-2xl hover:bg-yellow-400 font-black text-xs uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-xl shadow-yellow-100 flex items-center justify-center gap-3">
                                <Plus className="w-5 h-5 stroke-[3px]" /> RECHARGE PROTOCOL
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const DashboardStatCard = ({ icon, label, count, color, onClick }) => {
    const variants = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        orange: 'bg-orange-50 text-orange-600 border-orange-100',
        green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        red: 'bg-red-50 text-red-600 border-red-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100'
    }

    return (
        <div onClick={onClick} className="bg-white rounded-[32px] p-8 shadow-sm border border-transparent hover:border-gray-100 hover:shadow-2xl transition-all cursor-pointer group flex flex-col items-center text-center">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner transition-all group-hover:scale-110 ${variants[color] || 'bg-gray-50'}`}>
                {React.cloneElement(icon, { className: "w-7 h-7 stroke-[2.5px]" })}
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">{label}</p>
            <p className="text-4xl font-black text-gray-950 tracking-tighter">{count || 0}</p>
        </div>
    )
}

const ActionBoxSimple = ({ icon, label, count, onClick }) => (
    <div onClick={onClick} className="bg-white rounded-[32px] p-8 border border-gray-50 shadow-sm flex items-center justify-between group hover:shadow-xl hover:border-red-100 transition-all cursor-pointer">
        <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-gray-50 group-hover:bg-[#E31E24] group-hover:text-white rounded-2xl flex items-center justify-center transition-all duration-500 shadow-inner">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-2xl font-black text-gray-950 tracking-tighter leading-none">{count}</p>
            </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-[#E31E24] group-hover:translate-x-1 transition-all" />
    </div>
)

export default mainDash
