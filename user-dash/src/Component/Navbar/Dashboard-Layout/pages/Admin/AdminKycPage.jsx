import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ShieldCheck, ShieldX, Eye, X, User, FileText,
    CheckCircle, XCircle, Clock, Loader, AlertTriangle,
    ChevronRight, Hash, MapPin, Search, Filter
} from 'lucide-react';

function AdminKycPage() {
    const [kycList, setKycList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [selectedKyc, setSelectedKyc] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchKycList();
    }, []);

    const fetchKycList = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/kyc/list.php`,
                config
            );
            setKycList(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching KYC list:', err);
        } finally {
            setLoading(false);
        }
    };

    const openDetail = async (kyc) => {
        setDetailLoading(true);
        setSelectedKyc(kyc);
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/kyc/details.php?user_id=${kyc.user?.id}`,
                config
            );
            setSelectedKyc(prev => ({ ...prev, ...data }));
        } catch (err) {
            console.error('Error fetching KYC detail:', err);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleAction = async (kycId, action) => {
        setActionLoading(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/kyc/verify.php`,
                { kycId, status: action },
                config
            );
            setMessage({ type: 'success', text: `KYC ${action === 'verified' ? 'Approved' : 'Rejected'} successfully!` });
            setSelectedKyc(null);
            fetchKycList();
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Action failed. Please try again.' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (kycId) => {
        if (!window.confirm('Are you sure you want to delete this KYC record? The user will need to re-submit their documents.')) return;

        setActionLoading(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/kyc/delete.php`,
                { kycId },
                config
            );
            setMessage({ type: 'success', text: 'KYC record deleted successfully!' });
            fetchKycList();
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Deletion failed. Please try again.' });
        } finally {
            setActionLoading(false);
        }
    };

    const filteredList = kycList.filter(kyc => {
        const matchesTab = activeTab === 'all' || kyc.status === activeTab;
        const matchesSearch = (kyc.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (kyc.user?.email || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const counts = {
        all: kycList.length,
        pending: kycList.filter(k => k.status === 'pending').length,
        verified: kycList.filter(k => k.status === 'verified').length,
        rejected: kycList.filter(k => k.status === 'rejected').length
    };

    const ImageCard = ({ label, src }) => {
        const fullSrc = src ? (src.startsWith('http') ? src : `${import.meta.env.VITE_API_BASE_URL}/${src}`) : null;
        return (
            <div className="space-y-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                <div className="relative group aspect-video rounded-3xl bg-gray-50 border-2 border-gray-100 overflow-hidden flex items-center justify-center">
                    {fullSrc ? (
                        <>
                            <img
                                src={fullSrc}
                                alt={label}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button
                                    onClick={() => window.open(fullSrc, '_blank')}
                                    className="p-3 bg-white rounded-full text-gray-900 hover:scale-110 transition-transform shadow-xl"
                                >
                                    <Eye className="w-5 h-5" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-3 text-gray-200">
                            <FileText className="w-12 h-12" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Missing Document</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#FDF7F4] p-8 lg:p-12">
            <div className="max-w-[1500px] mx-auto space-y-10">
                {/* Header Section */}
                <div>
                    <h1 className="text-4xl font-black text-[#1A2B4B] tracking-tight mb-2">KYC Verification</h1>
                    <p className="text-gray-500 font-medium">Review and approve customer identity documents</p>
                </div>

                {/* Tabs & Stats */}
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="flex gap-4 p-1.5 bg-white rounded-[24px] shadow-sm border border-gray-100">
                        {['all', 'pending', 'verified', 'rejected'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-3 rounded-[18px] text-sm font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === tab
                                    ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-200'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {tab}
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] ${activeTab === tab ? 'bg-white/20' : 'bg-gray-100'}`}>
                                    {counts[tab]}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 bg-white px-6 py-2.5 rounded-[24px] shadow-sm border border-gray-100 min-w-[320px]">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-sm font-bold w-full"
                        />
                    </div>
                </div>

                {/* Main Table */}
                <div className="bg-white rounded-[40px] shadow-2xl shadow-[#1A2B4B]/5 border border-white/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer</th>
                                    <th className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Type</th>
                                    <th className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Location</th>
                                    <th className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Submitted At</th>
                                    <th className="px-10 py-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="py-32 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader className="w-8 h-8 animate-spin text-blue-600" />
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Records...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredList.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-32 text-center">
                                            <div className="w-20 h-20 bg-gray-50 rounded-[30px] flex items-center justify-center mx-auto mb-4">
                                                <ShieldCheck className="w-10 h-10 text-gray-200" />
                                            </div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No KYC Records Found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredList.map((kyc) => (
                                        <tr key={kyc._id} className="group hover:bg-[#FDF7F4]/30 transition-all duration-300">
                                            <td className="px-10 py-7">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                                                        <User className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-[#1A2B4B] text-[15px] uppercase tracking-tight line-clamp-1">{kyc.fullName || 'User Name'}</p>
                                                        <p className="text-[11px] font-bold text-gray-400 lowercase">{kyc.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-7">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${(kyc.user?.company_name || kyc.user?.gst_number) ? 'bg-purple-50 text-purple-600' : 'bg-pink-50 text-pink-600'}`}>
                                                    {(kyc.user?.company_name || kyc.user?.gst_number) ? 'Business' : 'Personal'}
                                                </span>
                                            </td>
                                            <td className="px-10 py-7">
                                                <div className="space-y-1">
                                                    <p className="text-[13px] font-black text-gray-700 uppercase tracking-tight">{(kyc.addressDetails || 'Surat, Gujarat').split(',')[0].toUpperCase()}</p>
                                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest opacity-60">{(kyc.addressDetails || '395004').split(',').pop()}</p>
                                                </div>
                                            </td>
                                            <td className="px-10 py-7">
                                                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${kyc.status === 'verified'
                                                    ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100'
                                                    : kyc.status === 'pending'
                                                        ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-100'
                                                        : 'bg-red-50 text-red-600 ring-1 ring-red-100'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${kyc.status === 'verified' ? 'bg-emerald-500' : kyc.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`} />
                                                    {kyc.status}
                                                </span>
                                            </td>
                                            <td className="px-10 py-7">
                                                <div className="space-y-0.5">
                                                    <p className="text-[13px] font-black text-gray-700 uppercase">{new Date(kyc.submittedAt).toLocaleDateString()}</p>
                                                    <p className="text-[11px] font-bold text-gray-400 uppercase opacity-60">{new Date(kyc.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </td>
                                            <td className="px-10 py-7 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => openDetail(kyc)}
                                                        className="inline-flex items-center gap-2 bg-white border border-gray-200 text-[#1A2B4B] px-5 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all shadow-sm hover:shadow-xl hover:-translate-y-0.5"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View Details
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(kyc._id)}
                                                        className="p-2.5 bg-red-50 text-red-600 rounded-[18px] hover:bg-red-600 hover:text-white transition-all border border-red-100 hover:shadow-lg shadow-red-200"
                                                    >
                                                        <ShieldX className="w-4 h-4" />
                                                    </button>
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

            {/* View Details Modal */}
            {selectedKyc && (
                <div className="fixed inset-0 bg-[#1A2B4B]/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[48px] w-full max-w-5xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col scale-in">
                        {/* Header */}
                        <div className="flex items-center justify-between p-10 border-b border-gray-50 bg-[#FDF7F4]/50">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-[28px] bg-white shadow-xl flex items-center justify-center text-3xl font-black text-[#2563EB]">
                                    {(selectedKyc.fullName || 'U')[0].toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-[#1A2B4B] tracking-tight uppercase">{selectedKyc.fullName}</h2>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Clock className="w-4 h-4" /> Status: <span className="text-blue-600">{selectedKyc.status?.toUpperCase()}</span>
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedKyc(null)} className="p-4 bg-white border border-gray-100 hover:bg-gray-50 rounded-full transition-all shadow-sm">
                                <X className="w-6 h-6 text-gray-900" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-12 space-y-12">
                            {detailLoading ? (
                                <div className="py-20 flex flex-col items-center gap-4">
                                    <Loader className="w-10 h-10 animate-spin text-blue-600" />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hydrating Details...</p>
                                </div>
                            ) : (
                                <>
                                    {/* Info Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="p-8 bg-gray-50/50 rounded-[32px] border border-gray-100/50">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Hash className="w-3.5 h-3.5" /> Identity Details</p>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-[11px] font-black text-gray-400 uppercase mb-1">Aadhaar Number</p>
                                                    <p className="text-lg font-black text-gray-900 font-mono tracking-widest">{selectedKyc.aadhaarNumber || selectedKyc.aadhaar_number}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black text-gray-400 uppercase mb-1">PAN Number</p>
                                                    <p className="text-lg font-black text-gray-900 font-mono tracking-widest uppercase">{selectedKyc.panNumber || selectedKyc.pan_number}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 bg-gray-50/50 rounded-[32px] border border-gray-100/50 md:col-span-2">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Residential Address</p>
                                            <p className="text-lg font-black text-[#1A2B4B] leading-relaxed uppercase">{selectedKyc.addressDetails || selectedKyc.full_address || '—'}</p>
                                        </div>
                                    </div>

                                    {/* Document Section */}
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                                <FileText className="w-4 h-4" /> Identity Documentation
                                            </h4>
                                            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-blue-100">Action Required</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            <ImageCard label="Aadhaar Front View" src={selectedKyc.aadhaarFrontImage || selectedKyc.aadhaar_front} />
                                            <ImageCard label="Aadhaar Back View" src={selectedKyc.aadhaarBackImage || selectedKyc.aadhaar_back} />
                                            <ImageCard label="PAN Verification Card" src={selectedKyc.panCardImage || selectedKyc.pan_card} />
                                        </div>
                                    </div>

                                    {/* Action Panel */}
                                    {selectedKyc.status === 'pending' && (
                                        <div className="flex gap-6 pt-10 mt-10 border-t border-gray-100">
                                            <button
                                                disabled={actionLoading}
                                                onClick={() => handleAction(selectedKyc._id, 'verified')}
                                                className="flex-1 bg-emerald-500 text-white py-6 rounded-[30px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-emerald-500/20 disabled:bg-gray-200 flex items-center justify-center gap-4 group"
                                            >
                                                {actionLoading ? <Loader className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6 group-hover:scale-125 transition-transform" />}
                                                Approve Verification
                                            </button>
                                            <button
                                                disabled={actionLoading}
                                                onClick={() => handleAction(selectedKyc._id, 'rejected')}
                                                className="px-12 bg-white border-2 border-red-50 text-red-600 py-6 rounded-[30px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-4 group shadow-sm hover:shadow-red-500/20"
                                            >
                                                {actionLoading ? <Loader className="w-6 h-6 animate-spin" /> : <ShieldX className="w-6 h-6 group-hover:rotate-90 transition-transform" />}
                                                Reject KYC
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Global Message */}
            {message && (
                <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-5 duration-500 bg-white px-8 py-5 rounded-[28px] shadow-2xl border flex items-center gap-4 ${message.type === 'success' ? 'border-emerald-100' : 'border-red-100'}`}>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {message.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{message.type === 'success' ? 'Success' : 'Attention'}</p>
                        <p className="text-sm font-black text-[#1A2B4B] uppercase tracking-tight">{message.text}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminKycPage;
