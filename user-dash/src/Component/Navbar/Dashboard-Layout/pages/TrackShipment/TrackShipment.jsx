import React, { useState } from 'react';
import axios from 'axios';
import {
    Search, Package, MapPin, Clock, CheckCircle, Circle, XCircle,
    Truck, ArrowRight, ShieldCheck, Box, Monitor, AlertCircle, TrendingUp,
    CheckCircle2, Building2, Zap, Layout
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

    const StatusDot = ({ completed, active }) => (
        <div className={`relative z-10 w-12 h-12 rounded-full border-4 border-white flex items-center justify-center transition-all duration-700 shadow-xl ${completed ? 'bg-blue-600 text-white shadow-blue-200' :
            active ? 'bg-blue-50 text-blue-600 border-blue-100 scale-110' :
                'bg-slate-50 text-slate-200'
            }`}>
            {completed ? <CheckCircle2 className="w-6 h-6 stroke-[2.5px]" /> : <Clock className="w-5 h-5 opacity-40" />}
        </div>
    );

    return (
        <div className="min-h-screen bg-white py-14 px-8 lg:px-14 font-sans selection:bg-blue-600 selection:text-white animate-in fade-in duration-700">
            <div className="max-w-[1400px] mx-auto">

                {/* Header Section from Image */}
                <div className="mb-14">
                    <h1 className="text-6xl font-black text-slate-900 tracking-[-0.04em] uppercase mb-4 leading-none">TRACKING CENTER</h1>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
                            <p className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase">HYPERLINK SECURE</p>
                        </div>
                        <div className="h-4 w-px bg-slate-200" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">REAL-TIME MANIFEST LOCALIZATION</p>
                    </div>
                </div>

                {/* Search Bar from Image */}
                <div className="bg-white rounded-[40px] p-8 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.06)] border border-slate-50 mb-16">
                    <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 font-black" />
                            <input
                                type="text"
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                                placeholder="ENTER BGL MANIFEST TOKEN..."
                                className="w-full bg-white border-2 border-blue-600 rounded-[32px] pl-20 pr-10 py-7 text-sm font-black outline-none focus:ring-8 focus:ring-blue-600/5 transition-all placeholder:text-slate-200 uppercase tracking-widest"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#0F172A] text-white px-16 py-7 rounded-[32px] text-[12px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-black active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-4 group/btn"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <><Zap className="w-5 h-5 fill-white" /> LOCALIZE JOURNEY</>
                            )}
                        </button>
                    </form>
                </div>

                {error && (
                    <div className="mb-14 p-10 bg-red-50 text-red-700 border border-red-100 rounded-[40px] flex items-center gap-6 animate-in slide-in-from-top-4 duration-500">
                        <AlertCircle className="w-8 h-8" />
                        <p className="text-sm font-black uppercase tracking-widest">{error}</p>
                    </div>
                )}

                {tracking && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-8 duration-700">

                        {/* Left Column */}
                        <div className="lg:col-span-8 space-y-10">

                            {/* Route Map Card */}
                            <div className="bg-white rounded-[48px] border border-slate-50 shadow-sm p-14 relative overflow-hidden group">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 relative z-10">
                                    <div className="text-center md:text-left">
                                        <div className="w-16 h-16 bg-blue-50/50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 mx-auto md:mx-0 shadow-inner">
                                            <Building2 className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight leading-none mb-3">{tracking.origin?.city || 'Origin Port'}</h2>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">MANIFEST CODE</p>
                                    </div>

                                    <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
                                        <div className="w-32 border-t-2 border-dashed border-slate-100" />
                                    </div>

                                    <div className="text-center md:text-right">
                                        <div className="w-16 h-16 bg-green-50/50 rounded-2xl flex items-center justify-center text-green-600 mb-8 mx-auto md:ml-auto md:mr-0 shadow-inner">
                                            <MapPin className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight leading-none mb-3">{tracking.destination?.name || 'Authorized'}</h2>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">{tracking.destination?.pincode || '295004'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Vitals Blocks */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <VitalBlock label="Network Status" value={tracking.status?.toUpperCase()} color="text-blue-600" />
                                <VitalBlock label="Payload Mass" value={`${tracking.package?.weight || 0.5} KG`} />
                                <VitalBlock label="Carrier Partner" value={tracking.courierPartner || "BGL PREMIUM"} />
                            </div>

                            {/* Operational Chronology (Timeline) */}
                            <div className="bg-white rounded-[48px] border border-slate-50 shadow-sm overflow-hidden">
                                <div className="px-12 py-10 bg-slate-50/10 border-b border-slate-100 flex items-center justify-between">
                                    <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Operational Chronology</h3>
                                    <Clock className="w-5 h-5 text-slate-200" />
                                </div>
                                <div className="p-16 space-y-20 relative">
                                    <div className="absolute left-[139px] top-28 bottom-28 w-1 bg-slate-50" />
                                    {tracking.timeline.map((item, idx) => (
                                        <div key={idx} className="flex gap-14 relative items-start group">
                                            <div className="w-28 text-right pt-2">
                                                <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                                                    {item.timestamp ? new Date(item.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'PENDING'}
                                                </p>
                                                <p className="text-[9px] text-slate-300 font-bold mt-1 tracking-widest leading-none">
                                                    {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                                                </p>
                                            </div>
                                            <StatusDot completed={item.completed} active={item.completed && idx === 0} />
                                            <div className="flex-1 pt-1">
                                                <h4 className={`text-xl font-black tracking-tight uppercase ${item.completed ? 'text-slate-900' : 'text-slate-200'}`}>{item.label}</h4>
                                                <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">{item.status || 'DRAFT'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Sidebar Column */}
                        <div className="lg:col-span-4 lg:sticky lg:top-10 h-fit">
                            <div className="bg-[#0F172A] rounded-[48px] p-12 text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] group-hover:bg-blue-600/20 transition-all duration-1000" />

                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-10">MANIFEST TOKEN</p>
                                <h3 className="text-4xl font-black tracking-tighter mb-4 leading-none">{tracking.trackingId || tracking.orderId}</h3>
                                <div className="h-1.5 w-20 bg-blue-600 rounded-full mb-12" />

                                <div className="space-y-12">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mb-4">RECIPIENT IDENTITY</p>
                                        <p className="text-2xl font-black tracking-tight uppercase leading-none">{tracking.destination?.name || 'MANISH RAJPUT'}</p>
                                    </div>

                                    <div className="bg-white/5 p-10 rounded-[40px] border border-white/5 backdrop-blur-sm">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em] mb-6">JOURNEY ESTIMATE</p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                                                <Clock className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <p className="text-[11px] font-black tracking-[0.1em] uppercase">ETA CALCULATION PENDING</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                {!tracking && !loading && !error && (
                    <div className="mt-20 text-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-inner group transition-transform hover:scale-110">
                            <Box className="w-10 h-10 text-slate-100 group-hover:text-blue-100 transition-colors" />
                        </div>
                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.6em] mb-4">Awaiting Signal Sequence</p>
                        <p className="text-sm text-slate-400 font-bold max-w-sm mx-auto leading-relaxed">Localize your payload's status by entering the cryptographic manifest identifier above.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const VitalBlock = ({ label, value, color = "text-slate-900" }) => (
    <div className="bg-white rounded-[40px] border border-slate-50 p-10 text-center shadow-sm hover:shadow-2xl hover:border-blue-50 transition-all duration-500 group">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em] mb-4 group-hover:text-blue-300 transition-colors">{label}</p>
        <p className={`text-2xl font-black tracking-tight uppercase leading-none ${color}`}>{value || 'NULL'}</p>
    </div>
);

export default TrackShipment;
