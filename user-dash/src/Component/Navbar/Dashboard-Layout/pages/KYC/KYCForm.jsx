import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, CheckCircle, AlertCircle, CreditCard, Home, X } from 'lucide-react';

function KYCForm({ onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [kycStatus, setKycStatus] = useState(null);
    const [accountType, setAccountType] = useState('personal');
    const [agreementAccepted, setAgreementAccepted] = useState(false);

    // Billing Data
    const [billingData, setBillingData] = useState({
        billingName: '',
        gstNumber: '',
        panNumber: '',
        email: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India'
    });

    // Business Data
    const [businessData, setBusinessData] = useState({
        businessName: '',
        gstNumber: '',
        businessType: '',
        businessAddress: ''
    });

    // Profile (READ ONLY)
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        mobile: ''
    });

    // KYC FORM DATA
    const [formData, setFormData] = useState({
        alternateContact: '',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        aadhaarNumber: '',
        panNumber: ''
    });

    // Files
    const [files, setFiles] = useState({
        aadhaarFront: null,
        aadhaarBack: null,
        panCard: null,
        electricityBill: null
    });

    /* ================================
        FETCH USER PROFILE
    ================================= */
    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/user/profile`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setProfile({
                fullName: `${data.firstname || ''} ${data.lastname || ''}`.trim(),
                email: data.email || '',
                mobile: data.mobile || ''
            });

            setFormData(prev => ({
                ...prev,
                alternateContact: data.mobile || ''
            }));

        } catch (err) {
            console.error('Profile fetch failed', err);
        }
    };

    /* ================================
        CHECK KYC STATUS
    ================================= */
    const checkKYCStatus = async () => {
        try {
            const token = localStorage.getItem('token');

            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/kyc/status`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setKycStatus(data);

            if (data.status !== 'not_submitted') {
                setFormData({
                    alternateContact: data.alternateContact || '',
                    addressLine1: data.address?.addressLine1 || '',
                    addressLine2: data.address?.addressLine2 || '',
                    landmark: data.address?.landmark || '',
                    city: data.address?.city || '',
                    state: data.address?.state || '',
                    pincode: data.address?.pincode || '',
                    country: data.address?.country || 'India',
                    aadhaarNumber: data.aadhaarNumber || '',
                    panNumber: data.panNumber || ''
                });
            }
        } catch (err) {
            console.error('KYC status error', err);
        }
    };

    /* ================================
        USE EFFECT
    ================================= */
    useEffect(() => {
        fetchUserProfile();
        checkKYCStatus();
    }, []);

    /* ================================
        HANDLERS
    ================================= */
    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBillingChange = e => {
        setBillingData({ ...billingData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e, name) => {
        setFiles({ ...files, [name]: e.target.files[0] });
    };

    const validateForm = () => {
        if (!formData.addressLine1) return 'Address required';
        if (!formData.city) return 'City required';
        if (!formData.state) return 'State required';
        if (!/^\d{6}$/.test(formData.pincode)) return 'Invalid pincode';
        if (!/^\d{12}$/.test(formData.aadhaarNumber)) return 'Invalid Aadhaar';
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.panNumber)) return 'Invalid PAN';
        if (!billingData.billingName) return 'Billing name required';
        if (!billingData.email) return 'Billing email required';
        if (!billingData.panNumber) return 'Billing PAN required';
        if (!agreementAccepted) return 'Please accept Terms & Conditions';
        return null;
    };
    // KYC Address → Billing Address (Auto)
    useEffect(() => {
        setBillingData(prev => ({
            ...prev,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            country: formData.country
        }));
    }, [
        formData.addressLine1,
        formData.addressLine2,
        formData.city,
        formData.state,
        formData.pincode,
        formData.country
    ]);

    // Personal Details → Billing Details (Auto)
    useEffect(() => {
        setBillingData(prev => ({
            ...prev,
            billingName: profile.fullName || prev.billingName,
            email: profile.email || prev.email,
            phone: profile.mobile || prev.phone
        }));
    }, [profile.fullName, profile.email, profile.mobile]);



    /* ================================
        SUBMIT
    ================================= */
    const handleSubmit = async e => {
        e.preventDefault();

        const error = validateForm();
        if (error) return setMessage({ type: 'error', text: error });

        if (!files.aadhaarFront || !files.aadhaarBack || !files.panCard) {
            return setMessage({ type: 'error', text: 'Upload required documents' });
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const fd = new FormData();

            // Clean and trim data
            const cleanFullName = profile.fullName.trim();
            const cleanAadhaar = formData.aadhaarNumber.trim().replace(/\s/g, '');
            const cleanPan = formData.panNumber.trim().toUpperCase();

            fd.append('fullName', cleanFullName);
            fd.append('alternateContact', formData.alternateContact.trim());
            fd.append('aadhaarNumber', cleanAadhaar);
            fd.append('accountType', accountType);

            if (accountType === 'business') {
                const cleanBusinessData = {
                    businessName: businessData.businessName.trim(),
                    gstNumber: businessData.gstNumber.trim().toUpperCase(),
                    businessType: businessData.businessType,
                    businessAddress: businessData.businessAddress?.trim()
                };
                fd.append('businessData', JSON.stringify(cleanBusinessData));
            }

            fd.append('panNumber', cleanPan);

            fd.append('address', JSON.stringify({
                addressLine1: formData.addressLine1.trim(),
                addressLine2: formData.addressLine2.trim(),
                landmark: formData.landmark.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                pincode: formData.pincode.trim(),
                country: formData.country.trim()
            }));

            // Billing - with trimming
            const cleanBillingData = {
                ...billingData,
                billingName: billingData.billingName.trim(),
                email: billingData.email.trim().toLowerCase(),
                panNumber: billingData.panNumber.trim().toUpperCase(),
                gstNumber: billingData.gstNumber?.trim()?.toUpperCase(),
                addressLine1: billingData.addressLine1?.trim(),
                addressLine2: billingData.addressLine2?.trim(),
                city: billingData.city?.trim(),
                state: billingData.state?.trim(),
                pincode: billingData.pincode?.trim()
            };
            fd.append('billing', JSON.stringify(cleanBillingData));

            // Agreement
            fd.append('agreementAccepted', agreementAccepted);

            // files
            fd.append('aadhaarFront', files.aadhaarFront);
            fd.append('aadhaarBack', files.aadhaarBack);
            fd.append('panCard', files.panCard);
            if (files.electricityBill) fd.append('electricityBill', files.electricityBill);

            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/kyc/submit`,
                fd,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setMessage({ type: 'success', text: 'KYC submitted successfully' });
            onSuccess?.();
            setTimeout(onClose, 2000);

        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Submit failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md sticky top-0 z-10 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                            Complete Your KYC
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Submit your documents for verification to start creating shipments
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* KYC Status Alert */}
                    {kycStatus && kycStatus.status !== 'not_submitted' && (
                        <div className="px-6 pt-6">
                            <div className={`p-4 rounded-xl border ${kycStatus.status === 'verified'
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                : kycStatus.status === 'pending'
                                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                }`}>
                                <div className="flex items-center gap-3">
                                    {kycStatus.status === 'verified' ? (
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : kycStatus.status === 'pending' ? (
                                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                    )}
                                    <div>
                                        <p className={`font-semibold ${kycStatus.status === 'verified'
                                            ? 'text-green-800 dark:text-green-400'
                                            : kycStatus.status === 'pending'
                                                ? 'text-yellow-800 dark:text-yellow-400'
                                                : 'text-red-800 dark:text-red-400'
                                            }`}>
                                            {kycStatus.status === 'verified'
                                                ? 'KYC Verified ✓'
                                                : kycStatus.status === 'pending'
                                                    ? 'KYC Verification Pending'
                                                    : 'KYC Rejected'}
                                        </p>
                                        {kycStatus.rejectionReason && (
                                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                                Reason: {kycStatus.rejectionReason}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* KYC STATUS NOTICE */}
                        {kycStatus && kycStatus.status === 'verified' && (
                            <div className="bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-lg mb-4 text-center font-medium border border-green-200 dark:border-green-800">
                                Your KYC is Verified! You can still update your details if needed.
                            </div>
                        )}
                        {kycStatus && kycStatus.status === 'pending' && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 p-4 rounded-lg mb-4 text-center font-medium border border-yellow-200 dark:border-yellow-800">
                                KYC verification is in progress. Updating details now will restart the process.
                            </div>
                        )}
                        {kycStatus && kycStatus.status === 'rejected' && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg mb-4 text-center font-medium border border-red-200 dark:border-red-800">
                                KYC was rejected. Please update and re-submit with correct details.
                            </div>
                        )}

                        {/* Personal Details */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                                Personal Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.fullName}
                                        readOnly
                                        className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        readOnly
                                        className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Mobile Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={profile.mobile}
                                        readOnly
                                        className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <br />

                            {/* ACCOUNT TYPE */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Account Type</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setAccountType('personal')}
                                        className={`p-4 rounded-xl border-2 transition-all ${accountType === 'personal'
                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                                            }`}
                                    >
                                        Personal
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAccountType('business')}
                                        className={`p-4 rounded-xl border-2 transition-all ${accountType === 'business'
                                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                                            }`}
                                    >
                                        Business
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Address Details */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Home className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                Address Details
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Address Line 1 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="addressLine1"
                                        value={formData.addressLine1}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500"
                                        placeholder="House/Flat No., Street"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Address Line 2
                                        </label>
                                        <input
                                            type="text"
                                            name="addressLine2"
                                            value={formData.addressLine2}
                                            onChange={handleChange}
                                            disabled={kycStatus?.status && kycStatus.status !== 'not_submitted' && kycStatus.status !== 'rejected'}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500"
                                            placeholder="Area, Locality"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Landmark
                                        </label>
                                        <input
                                            type="text"
                                            name="landmark"
                                            value={formData.landmark}
                                            onChange={handleChange}
                                            disabled={kycStatus?.status && kycStatus.status !== 'not_submitted' && kycStatus.status !== 'rejected'}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500"
                                            placeholder="Near..."
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            City <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            disabled={kycStatus?.status && kycStatus.status !== 'not_submitted' && kycStatus.status !== 'rejected'}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500"
                                            placeholder="City"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            State <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            disabled={kycStatus?.status && kycStatus.status !== 'not_submitted' && kycStatus.status !== 'rejected'}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500"
                                            placeholder="State"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Pincode <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            disabled={kycStatus?.status && kycStatus.status !== 'not_submitted' && kycStatus.status !== 'rejected'}
                                            required
                                            maxLength="6"
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500"
                                            placeholder="110001"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Document Details */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                Document Details
                            </h3>
                            <div className="space-y-4">
                                {/* Aadhaar */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Aadhaar Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="aadhaarNumber"
                                            value={formData.aadhaarNumber}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                if (value.length <= 12) {
                                                    setFormData({ ...formData, aadhaarNumber: value });
                                                }
                                            }}
                                            required
                                            maxLength="12"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500"
                                            placeholder="XXXX XXXX XXXX"
                                        />
                                    </div>
                                    {(!kycStatus || kycStatus.status === 'not_submitted' || kycStatus.status === 'rejected') && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Aadhaar Front <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="image/*,application/pdf"
                                                    onChange={(e) => handleFileChange(e, 'aadhaarFront')}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Aadhaar Back <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="file"
                                                    accept="image/*,application/pdf"
                                                    onChange={(e) => handleFileChange(e, 'aadhaarBack')}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* PAN */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            PAN Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="panNumber"
                                            value={formData.panNumber}
                                            onChange={handleChange}
                                            required
                                            maxLength="10"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500"
                                            placeholder="ABCDE1234F"
                                        />
                                    </div>
                                    {(!kycStatus || kycStatus.status === 'not_submitted' || kycStatus.status === 'rejected') && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                PAN Card Image <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="file"
                                                accept="image/*,application/pdf"
                                                onChange={(e) => handleFileChange(e, 'panCard')}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            />
                                        </div>
                                    )}
                                </div>


                            </div>
                        </div>

                        {/* Business Details */}
                        {accountType === 'business' && (
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Business Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Business Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Business Name"
                                            value={businessData.businessName}
                                            onChange={e =>
                                                setBusinessData({ ...businessData, businessName: e.target.value })
                                            }
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            GST Number
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="GST Number"
                                            value={businessData.gstNumber}
                                            onChange={e =>
                                                setBusinessData({
                                                    ...businessData,
                                                    gstNumber: e.target.value.toUpperCase()
                                                })
                                            }
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Business Type
                                        </label>
                                        <select
                                            value={businessData.businessType}
                                            onChange={e =>
                                                setBusinessData({ ...businessData, businessType: e.target.value })
                                            }
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500"
                                        >
                                            <option value="">Select Business Type</option>
                                            <option value="proprietorship">Proprietorship</option>
                                            <option value="partnership">Partnership</option>
                                            <option value="private_limited">Private Limited</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Billing Details */}
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                Billing Details
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Billing Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="billingName"
                                            value={billingData.billingName}
                                            onChange={handleBillingChange}
                                            disabled={kycStatus?.status && kycStatus.status !== 'not_submitted' && kycStatus.status !== 'rejected'}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500"
                                            placeholder="Billing Name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={billingData.email}
                                            onChange={handleBillingChange}
                                            disabled={kycStatus?.status && kycStatus.status !== 'not_submitted' && kycStatus.status !== 'rejected'}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500"
                                            placeholder="billing@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            PAN Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="panNumber"
                                            value={billingData.panNumber}
                                            onChange={handleBillingChange}
                                            disabled={kycStatus?.status && kycStatus.status !== 'not_submitted' && kycStatus.status !== 'rejected'}
                                            required
                                            maxLength="10"
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500"
                                            placeholder="ABCDE1234F"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={billingData.phone}
                                            onChange={handleBillingChange}
                                            disabled={kycStatus?.status && kycStatus.status !== 'not_submitted' && kycStatus.status !== 'rejected'}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500"
                                            placeholder="+91 9876543210"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        GST Number {accountType === 'personal' && <span className="text-gray-500 text-xs">(Optional)</span>}
                                    </label>
                                    <input
                                        type="text"
                                        name="gstNumber"
                                        value={billingData.gstNumber}
                                        onChange={handleBillingChange}
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500"
                                        placeholder="GST Number (optional for personal)"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Address Line 1
                                    </label>
                                    <input
                                        type="text"
                                        name="addressLine1"
                                        value={billingData.addressLine1}
                                        onChange={handleBillingChange}
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500"
                                        placeholder="Billing Address Line 1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Address Line 2
                                    </label>
                                    <input
                                        type="text"
                                        name="addressLine2"
                                        value={billingData.addressLine2}
                                        onChange={handleBillingChange}
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500"
                                        placeholder="Billing Address Line 2"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={billingData.city}
                                            onChange={handleBillingChange}
                                            disabled={kycStatus?.status && kycStatus.status !== 'not_submitted' && kycStatus.status !== 'rejected'}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500"
                                            placeholder="City"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            State
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={billingData.state}
                                            onChange={handleBillingChange}
                                            disabled={kycStatus?.status && kycStatus.status !== 'not_submitted' && kycStatus.status !== 'rejected'}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500"
                                            placeholder="State"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Pincode
                                        </label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={billingData.pincode}
                                            onChange={handleBillingChange}
                                            disabled={kycStatus?.status && kycStatus.status !== 'not_submitted' && kycStatus.status !== 'rejected'}
                                            maxLength="6"
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500"
                                            placeholder="110001"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        {(!kycStatus || kycStatus.status === 'not_submitted' || kycStatus.status === 'rejected') && (
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Terms & Conditions</h3>
                                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 max-h-64 overflow-y-auto mb-4">
                                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                                        <p className="font-semibold mb-2">By using our platform, you agree to the following:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-2">
                                            <li>All shipments are subject to applicable laws, carrier rules, and company policies</li>
                                            <li>You are responsible for providing accurate information</li>
                                            <li>Documents submitted must be authentic and valid</li>
                                            <li>Any false information may result in account suspension</li>
                                            <li>We reserve the right to verify all submitted documents</li>
                                        </ul>
                                    </div>
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={agreementAccepted}
                                        onChange={e => setAgreementAccepted(e.target.checked)}
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        I agree to the Terms & Conditions and Privacy Policy <span className="text-red-500">*</span>
                                    </span>
                                </label>
                            </div>
                        )}

                        {/* Message */}
                        {message && (
                            <div className={`p-4 rounded-lg ${message.type === 'success'
                                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                                }`}>
                                <p className={message.type === 'success'
                                    ? 'text-green-800 dark:text-green-400'
                                    : 'text-red-800 dark:text-red-400'
                                }>
                                    {message.text}
                                </p>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer with Actions */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex gap-4 sticky bottom-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-white dark:hover:bg-gray-800 font-semibold shadow-sm transition-all"
                    >
                        Close
                    </button>
                    {(!kycStatus || kycStatus.status === 'not_submitted' || kycStatus.status === 'rejected') && (
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading || !agreementAccepted}
                            className="flex-1 px-6 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-lg shadow-blue-500/30 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            {loading ? 'Submitting...' : 'Submit Documents'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default KYCForm;