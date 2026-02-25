import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ShieldCheck, ShieldX, Eye, X, User, FileText,
    CheckCircle, XCircle, Clock, Loader, AlertTriangle,
    ChevronRight, Hash, MapPin
} from 'lucide-react';

function AdminKycPage() {
    const [pendingList, setPendingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedKyc, setSelectedKyc] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/kyc/pending`,
                config
            );
            setPendingList(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching pending KYC:', err);
        } finally {
            setLoading(false);
        }
    };

    const openDetail = async (kyc) => {
        setDetailLoading(true);
        setSelectedKyc(kyc); // show modal immediately with basic data
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/kyc/details?user_id=${kyc.userId?._id || kyc._id}`,
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
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/kyc/verify`,
                { kycId, status: action },
                config
            );
            setMessage({ type: 'success', text: `KYC ${action === 'verified' ? 'Approved' : 'Rejected'} successfully!` });
            setSelectedKyc(null);
            fetchPending(); // Refresh list
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Action failed. Please try again.' });
        } finally {
            setActionLoading(false);
        }
    };

    const ImageCard = ({ label, src }) => {
        const fullSrc = src ? `${import.meta.env.VITE_API_BASE_URL}/${src}` : null;
        return (
            <div className="space-y-2">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
                <div className="w-full h-44 rounded-[20px] bg-gray-50 border-2 border-gray-100 overflow-hidden flex items-center justify-center">
                    {fullSrc ? (
                        <img
                            src={fullSrc}
                            alt={label}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                            onClick={() => window.open(fullSrc, '_blank')}
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-gray-300">
                            <FileText className="w-10 h-10" />
                            <span className="text-[10px] font-black uppercase">Not Uploaded</span>
                        </div>
                    )}
                </div>
                {fullSrc && (
                    <button
                        onClick={() => window.open(fullSrc, '_blank')}
                        className="text-[10px] font-black text-blue-500 uppercase tracking-wider hover:underline"
                    >
                        Open Full Size →
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">KYC Approvals</h1>
                <p className="text-gray-500 font-bold text-sm">Review and verify customer identity documents.</p>
            </div>

            {/* Flash Message */}
            {message && (
                <div className={`mb-6 p-4 rounded-2xl flex items-center gap-4 border-2 ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    <span className="font-black uppercase text-xs tracking-widest">{message.text}</span>
                </div>
            )}

            {/* Main Table */}
            <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="py-32 flex flex-col items-center gap-4">
                        <Loader className="w-10 h-10 animate-spin text-red-600" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Loading KYC Requests...</p>
                    </div>
                ) : pendingList.length === 0 ? (
                    <div className="py-32 flex flex-col items-center gap-4">
                        <div className="w-24 h-24 bg-green-50 rounded-[30px] flex items-center justify-center">
                            <ShieldCheck className="w-12 h-12 text-green-500" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">All Clear!</h3>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">No pending KYC verifications.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-50">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Aadhaar No.</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">PAN No.</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {pendingList.map((kyc) => (
                                <tr key={kyc._id} className="group hover:bg-gray-50/30 transition-all">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-100">
                                                <span className="text-white font-black text-lg">
                                                    {(kyc.userId?.firstname || kyc.fullName || 'U')[0].toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 text-sm uppercase tracking-tight">
                                                    {kyc.userId?.firstname} {kyc.userId?.lastname}
                                                </p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">{kyc.fullName || 'KYC Applicant'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="font-black text-sm text-gray-800 tracking-widest font-mono">
                                            {kyc.aadhaarNumber ? `XXXX-XXXX-${kyc.aadhaarNumber.slice(-4)}` : '—'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="font-black text-sm text-gray-800 tracking-widest font-mono uppercase">
                                            {kyc.panNumber || '—'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase border-2 bg-yellow-50 text-yellow-700 border-yellow-200">
                                            <Clock className="w-3.5 h-3.5" />
                                            Pending Review
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button
                                            onClick={() => openDetail(kyc)}
                                            className="flex items-center gap-2 ml-auto bg-gray-900 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Review KYC
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Detail Modal */}
            {selectedKyc && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-[40px] w-full max-w-3xl my-8 shadow-2xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-8 border-b border-gray-50">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-xl shadow-red-100">
                                    <span className="text-white font-black text-2xl">
                                        {(selectedKyc.userId?.firstname || 'U')[0].toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                                        {selectedKyc.userId?.firstname} {selectedKyc.userId?.lastname}
                                    </h2>
                                    <p className="text-[10px] font-black text-yellow-600 uppercase tracking-widest flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> KYC Pending Verification
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedKyc(null)} className="p-3 hover:bg-gray-100 rounded-2xl transition-colors">
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {detailLoading ? (
                            <div className="py-20 flex flex-col items-center gap-4">
                                <Loader className="w-8 h-8 animate-spin text-red-600" />
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading Details...</p>
                            </div>
                        ) : (
                            <div className="p-8 space-y-8">
                                {/* Identity Fields */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-5 bg-gray-50/50 rounded-[20px]">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Full Name on Documents</p>
                                        <p className="text-base font-black text-gray-900 uppercase">{selectedKyc.fullName || selectedKyc.full_name || '—'}</p>
                                    </div>
                                    <div className="p-5 bg-gray-50/50 rounded-[20px]">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Aadhaar Number</p>
                                        <p className="text-base font-black text-gray-900 tracking-widest font-mono">
                                            {selectedKyc.aadhaarNumber || selectedKyc.aadhaar_number || '—'}
                                        </p>
                                    </div>
                                    <div className="p-5 bg-gray-50/50 rounded-[20px]">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">PAN Number</p>
                                        <p className="text-base font-black text-gray-900 tracking-widest font-mono uppercase">
                                            {selectedKyc.panNumber || selectedKyc.pan_number || '—'}
                                        </p>
                                    </div>
                                    <div className="p-5 bg-gray-50/50 rounded-[20px]">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">KYC Status</p>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-black uppercase bg-yellow-100 text-yellow-700">
                                            <Clock className="w-3 h-3" /> Awaiting Admin Review
                                        </span>
                                    </div>
                                </div>

                                {/* Document Images */}
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <FileText className="w-4 h-4" /> Uploaded Documents
                                    </h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <ImageCard label="Aadhaar Front" src={selectedKyc.aadhaarFrontImage || selectedKyc.aadhaar_front} />
                                        <ImageCard label="Aadhaar Back" src={selectedKyc.aadhaarBackImage || selectedKyc.aadhaar_back} />
                                        <ImageCard label="PAN Card" src={selectedKyc.panCardImage || selectedKyc.pan_card} />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-4 border-t border-gray-50">
                                    <button
                                        disabled={actionLoading}
                                        onClick={() => handleAction(selectedKyc._id, 'verified')}
                                        className="flex-1 flex items-center justify-center gap-3 bg-green-600 text-white py-4 rounded-[24px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-xl shadow-green-100 disabled:opacity-50"
                                    >
                                        {actionLoading ? <Loader className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                                        Approve KYC
                                    </button>
                                    <button
                                        disabled={actionLoading}
                                        onClick={() => handleAction(selectedKyc._id, 'rejected')}
                                        className="flex-1 flex items-center justify-center gap-3 bg-red-600 text-white py-4 rounded-[24px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-100 disabled:opacity-50"
                                    >
                                        {actionLoading ? <Loader className="w-5 h-5 animate-spin" /> : <ShieldX className="w-5 h-5" />}
                                        Reject KYC
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminKycPage;
