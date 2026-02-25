import React from 'react'
import { Package, Truck, Plus, FileText, Wallet, CheckCircle, AlertTriangle, ChevronRight, TrendingUp, Clock, ArrowRight } from 'lucide-react'
function mainDash({ setActiveRoute, setOrdersTab, stats }) {
    const orders = stats?.orders || {};
    const walletBalance = stats?.user?.walletBalance || 0;

    const handleStatsClick = (tabId) => {
        if (setOrdersTab) setOrdersTab(tabId);
        setActiveRoute('orders');
    };

    return (
        <div className="p-8 lg:p-12 min-h-screen bg-[#F4F6F8]">
            <div className="max-w-[1500px] mx-auto space-y-10">

                {/* ===== WELCOME SECTION ===== */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8 flex flex-col lg:flex-row justify-between gap-10">

                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                            Welcome {stats?.user?.name}
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Manage your shipping access, KYC status and domestic & international deliveries.
                        </p>

                        <div className="flex gap-4 flex-wrap">
                            <div className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-semibold flex items-center gap-2">
                                DOMESTIC
                                {stats?.user?.kycStatus === 'verified' && (
                                    <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                        Verified
                                    </span>
                                )}
                                {stats?.user?.kycStatus === 'pending' && (
                                    <span className="px-2 py-1 bg-amber-100 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                        Pending Verification
                                    </span>
                                )}
                                {(stats?.user?.kycStatus === 'not_submitted' || stats?.user?.kycStatus === 'rejected') && (
                                    <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                        Not Verified
                                    </span>
                                )}
                            </div>

                            <div className={`px-4 py-2 bg-gray-100 rounded-xl text-sm font-semibold flex items-center gap-2 ${stats?.user?.kycStatus !== 'verified' ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}>
                                INTERNATIONAL
                                {stats?.user?.kycStatus === 'verified' ? (
                                    <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                                        Verified
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 bg-gray-200 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-wider">
                                        KYC Reqd
                                    </span>
                                )}
                            </div>
                        </div>

                        <p className={`text-sm font-medium mt-4 ${stats?.user?.kycStatus === 'verified' ? 'text-green-600' : 'text-slate-400'}`}>
                            {stats?.user?.kycStatus === 'verified'
                                ? 'Your account is fully verified and ready for global shipping.'
                                : 'Complete your KYC verification to unlock domestic and international shipping modules.'}
                        </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 w-full lg:w-[320px]">
                        <h4 className="font-semibold text-gray-800 mb-2">Verification Hub</h4>
                        <p className="text-gray-500 text-sm mb-5">
                            {stats?.user?.kycStatus === 'verified'
                                ? 'Your documents are verified. You can view your details here.'
                                : 'Upload your Aadhaar & PAN details to start shipping.'}
                        </p>

                        <button
                            onClick={() => setActiveRoute('kyc')}
                            className={`w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${stats?.user?.kycStatus === 'verified'
                                ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                : 'bg-red-600 text-white hover:bg-black shadow-lg shadow-red-500/20'}`}
                        >
                            {stats?.user?.kycStatus === 'verified' ? 'View KYC Status' : 'Complete KYC Now'}
                        </button>
                    </div>

                </div>

                {/* ===== OVERVIEW ===== */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">
                        Overview
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <DashboardStatCard icon={<Package />} label="All Orders" count={orders.total || 0} color="blue" onClick={() => handleStatsClick('all')} />
                        <DashboardStatCard icon={<FileText />} label="Drafted" count={orders.draft || 0} color="orange" onClick={() => handleStatsClick('draft')} />
                        <DashboardStatCard icon={<CheckCircle />} label="Ready" count={orders.ready || 0} color="green" onClick={() => handleStatsClick('ready')} />
                        <DashboardStatCard icon={<Package />} label="Packed" count={orders.packed || 0} color="red" onClick={() => handleStatsClick('packed')} />
                    </div>
                </div>

                {/* ===== ACTION + WALLET ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Action Required
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <ActionBoxSimple icon={<Truck />} label="Scheduled Pickups" count={orders.manifested || 0} onClick={() => handleStatsClick('manifested')} />
                            <ActionBoxSimple icon={<FileText />} label="Active Manifests" count={orders.manifested || 0} onClick={() => setActiveRoute('manifests')} />
                            <ActionBoxSimple icon={<AlertTriangle />} label="Disputes / RTO" count={orders.disputed || 0} onClick={() => handleStatsClick('disputed')} />
                        </div>
                    </div>

                    {/* RIGHT WALLET */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Wallet
                        </h3>

                        <div className="rounded-3xl p-8 bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white shadow-xl">
                            <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                                Available Balance
                            </p>

                            <h2 className="text-4xl font-bold mb-6">
                                ₹{Math.round(walletBalance).toLocaleString('en-IN')}
                            </h2>

                            <button
                                onClick={() => setActiveRoute('wallet')}
                                className="w-full bg-white text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                            >
                                Recharge Wallet
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
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
