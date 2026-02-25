import React, { useState } from 'react';
import axios from 'axios';
import {
    Search, Package, MapPin, Clock, CheckCircle, Circle, XCircle,
    Truck, ArrowRight, ShieldCheck, Box, Monitor, AlertCircle, TrendingUp,
    CheckCircle2, Building2, Zap, Layout, ArrowLeft, Download, RefreshCw
} from 'lucide-react';

function TrackShipment() {
    const [trackingId, setTrackingId] = useState('');
    const [tracking, setTracking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTrack = async (e, idOverride = null) => {
        if (e && e.preventDefault) e.preventDefault();
        const idToTrack = idOverride || trackingId;

        if (!idToTrack.trim()) {
            setError('Please provide a tracking identifier');
            return;
        }

        setLoading(true);
        setError(null);
        setTracking(null);

        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/track/index.php?id=${idToTrack.trim()}`);
            setTracking(data);
        } catch (err) {
            console.error('Tracking error:', err);
            setError(err.response?.data?.message || 'Tracking identifier not recognized in our systems');
        } finally {
            setLoading(false);
        }
    };

    const formatOrderDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }) + ' at ' + date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).toLowerCase();
    };

    return (
        <div className="min-h-screen bg-slate-50/20 py-10 px-6 lg:px-10 font-sans animate-in fade-in duration-700">
            <div className="max-w-[1400px] mx-auto">

                {/* Header Section */}
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase mb-2">Tracking Center</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                            <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Live Manifest Localization</p>
                        </div>
                    </div>
                </div>

                {/* Search Interface */}
                <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 mb-12">
                    <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-5">
                        <div className="flex-1 relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
                            <input
                                type="text"
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                                placeholder="ENTER BGL MANIFEST TOKEN / TRACKING ID"
                                className="w-full bg-slate-50/50 border-2 border-transparent focus:border-blue-600 rounded-2xl pl-14 pr-6 py-5 text-sm font-black outline-none transition-all placeholder:text-slate-300 uppercase tracking-widest"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-slate-900 text-white px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg hover:bg-black active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <><Zap className="w-4 h-4" /> Localize Journey</>
                            )}
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="mb-12 p-8 bg-red-50 text-red-700 border border-red-100 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
                        <AlertCircle className="w-6 h-6" />
                        <p className="text-xs font-black uppercase tracking-widest">{error}</p>
                    </div>
                )}

                {tracking && (
                    <div className="animate-in slide-in-from-bottom-8 duration-700">
                        {/* Live Status Header */}
                        <div className="bg-white rounded-[32px] p-6 mb-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-700" />
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-16 h-16 bg-blue-50 rounded-[24px] flex items-center justify-center relative">
                                    <TrendingUp className="w-8 h-8 text-blue-600" />
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                                        CURRENT SIGNAL <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                                    </p>
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">
                                        {tracking.status?.replace('_', ' ') || 'In Transit'}
                                    </h2>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="text-right hidden md:block">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Node Sync</p>
                                    <p className="text-xs font-black text-slate-900">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Hub Standard</p>
                                </div>
                                <div className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200">
                                    {tracking.courierPartner || 'BGL GLOBAL'}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                            {/* Left Column: Tracking Info */}
                            <div className="lg:col-span-4 space-y-6">
                                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                                    <div className="flex items-center gap-3 mb-8">
                                        <Truck className="w-5 h-5 text-slate-400" />
                                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Tracking Intel</h2>
                                    </div>

                                    {/* AWB Card */}
                                    <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 mb-10">
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">TRACKING ID / AWB</p>
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-black text-blue-700 tracking-tight">
                                                {tracking.trackingId || tracking.orderId}
                                            </h3>
                                            <div className="px-3 py-1 bg-white border border-blue-200 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-lg">
                                                ACTIVE
                                            </div>
                                        </div>
                                        <p className="text-[9px] font-bold text-blue-400 mt-2 uppercase">Courier: {tracking.courierPartner || 'BGL-EXPRESS'}</p>
                                    </div>

                                    {/* Timeline */}
                                    <div className="space-y-12 pl-1 relative">
                                        {tracking.timeline?.map((item, idx) => (
                                            <div key={idx} className="relative flex gap-6 group">
                                                {idx !== tracking.timeline.length - 1 && (
                                                    <div className="absolute left-[15px] top-8 bottom-[-3rem] w-[2px] bg-slate-100" />
                                                )}
                                                <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${idx === 0
                                                    ? 'bg-blue-600 text-white border-2 border-white ring-4 ring-blue-50'
                                                    : 'bg-white border-2 border-slate-100 text-slate-300'
                                                    }`}>
                                                    {idx === 0 ? <TrendingUp className="w-4 h-4 animate-pulse" /> : <CheckCircle2 className="w-4 h-4" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{item.label}</h4>
                                                        <span className="text-[9px] font-black text-slate-300 uppercase shrink-0">
                                                            {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-1">{item.status || 'Manifest Logged'}</p>
                                                    {item.location && (
                                                        <div className="mt-2 flex items-center gap-1.5">
                                                            <div className="w-1 h-1 rounded-full bg-blue-500" />
                                                            <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest">{item.location}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {(!tracking.timeline || tracking.timeline.length === 0) && (
                                            <div className="py-10 text-center">
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Awaiting Initial Node</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Informatics */}
                            <div className="lg:col-span-8 space-y-6">
                                {/* Route Card */}
                                <div className="bg-white rounded-3xl border-t-4 border-t-blue-500 border-x border-b border-slate-100 shadow-sm p-10">
                                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-8">
                                        {/* ORIGIN */}
                                        <div>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Building2 className="w-4 h-4" /></div>
                                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">ORIGIN HUB</span>
                                            </div>
                                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                                                {tracking.origin?.city || 'BGL Network Node'}
                                            </h3>
                                            <p className="text-[10px] text-slate-500 font-bold mt-2 leading-relaxed uppercase opacity-70">
                                                Processing Terminal<br />
                                                {tracking.origin?.city || 'Surat Hub'}, India
                                            </p>
                                        </div>

                                        {/* Connection */}
                                        <div className="flex flex-col items-center">
                                            <div className="w-32 border-t-2 border-dotted border-slate-100 relative">
                                                <Truck className="w-5 h-5 text-slate-200 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1" />
                                            </div>
                                        </div>

                                        {/* DESTINATION */}
                                        <div className="text-right">
                                            <div className="flex items-center justify-end gap-3 mb-6">
                                                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">DESTINATION</span>
                                                <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center"><MapPin className="w-4 h-4" /></div>
                                            </div>
                                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                                                {tracking.destination?.name || 'Authorized consignee'}
                                            </h3>
                                            <p className="text-[10px] text-slate-500 font-bold mt-2 leading-relaxed uppercase opacity-70">
                                                Inbound Terminal<br />
                                                {tracking.destination?.pincode || 'Postal Area'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Package Details Ledger */}
                                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="p-8 pb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Package className="w-5 h-5 text-slate-400" />
                                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Shipment Content</h3>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SECURE PAYLOAD</span>
                                    </div>

                                    <div className="px-8 pb-8">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <th className="py-6 font-black">Manifest Unit</th>
                                                    <th className="py-6 font-black text-right">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {(tracking.package?.items && tracking.package.items.length > 0) ? tracking.package.items.map((item, idx) => (
                                                    <tr key={idx} className="group transition-colors">
                                                        <td className="py-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-200 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all duration-500 overflow-hidden border border-slate-100/50">
                                                                    {(item.images && item.images.length > 0) ? (
                                                                        <img
                                                                            src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '').replace('/backend', '')}${item.images[0]}`}
                                                                            alt={item.name}
                                                                            className="w-full h-full object-cover"
                                                                            onError={(e) => {
                                                                                e.target.onerror = null;
                                                                                e.target.src = '';
                                                                                e.target.parentElement.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>';
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <Box className="w-5 h-5" />
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{item.name || 'Shipment Unit'}</p>
                                                                    <p className="text-[9px] text-slate-300 font-bold mt-1 uppercase tracking-widest">Qty: {item.quantity || 1}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-6 text-right">
                                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100">
                                                                MANIFESTED
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr className="group transition-colors">
                                                        <td className="py-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-200 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all duration-500">
                                                                    <Box className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">BGL Verified Parcel</p>
                                                                    <p className="text-[9px] text-slate-300 font-bold mt-1 uppercase tracking-widest">Weight: {tracking.package?.weight || 0.5} kg</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-6 text-right">
                                                            <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-green-100">
                                                                {tracking.status || 'Active'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>

                                        {/* Package Vitals Footer */}
                                        <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-2 gap-8">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">NETWORK STATUS</p>
                                                <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{tracking.status?.toUpperCase() || 'IN TRANSIT'}</p>
                                            </div>
                                            <div className="space-y-1 text-right">
                                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">MANIFEST TIMESTAMP</p>
                                                <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">
                                                    {tracking.timeline?.[0]?.timestamp ? new Date(tracking.timeline[0].timestamp).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!tracking && !loading && !error && (
                    <div className="mt-20 text-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-inner group transition-transform hover:scale-110">
                            <Box className="w-8 h-8 text-slate-200 group-hover:text-blue-200 transition-colors" />
                        </div>
                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.6em] mb-4">Awaiting Signal</p>
                        <p className="text-xs text-slate-400 font-bold max-w-sm mx-auto leading-relaxed">Enter your cryptographic manifest identifier to localize your journey.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TrackShipment;
