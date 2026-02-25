import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    X, ChevronRight, ChevronLeft, Package, MapPin, CheckCircle, Upload,
    Image as ImageIcon, CreditCard, Loader2, Pencil, Truck, Building2, Info,
    Layers, Zap, ShieldAlert, Cpu, Database, Box
} from 'lucide-react';
import { Country, State, City } from 'country-state-city';
import StepConsigneeDetails from './components/StepConsigneeDetails';
import StepShipmentDetails from './components/StepShipmentDetails';
import StepServiceSelection from './components/StepServiceSelection';
import StepPaymentSummary from './components/StepPaymentSummary';

function AddOrderModal({ onClose, onSuccess, setActiveRoute, user, editOrder, adminUserId }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [createdOrderId, setCreatedOrderId] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState(null);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [loadingLater, setLoadingLater] = useState(false);
    const [selectedGateway, setSelectedGateway] = useState('razorpay');
    const [gatewayStatus, setGatewayStatus] = useState(null);
    const [userRole, setUserRole] = useState('user');
    const isSubmittingRef = useRef(false);
    const razorpayLoaded = useRef(false);
    const loadingFromAutoFill = useRef(false);

    const [formData, setFormData] = useState({
        pickupAddressId: '',
        isNewPickupAddress: false,
        newPickupAddress: { name: '', mobile: '', address1: '', city: '', state: '', pincode: '' },
        firstName: '',
        lastName: '',
        mobileNumber: '',
        alternateMobile: '',
        email: '',
        country: 'IN',
        address1: '',
        address2: '',
        landmark: '',
        pincode: '',
        city: '',
        state: '',
        billingAddressSame: true,
        paymentMode: 'Prepaid',
        serviceType: 'Express',
        items: []
    });

    const [errors, setErrors] = useState({});
    const [countries] = useState(Country.getAllCountries());
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [pickupStates, setPickupStates] = useState([]);
    const [pickupCities, setPickupCities] = useState([]);
    const [kycAddress, setKycAddress] = useState(null);
    const [kycLoading, setKycLoading] = useState(true);
    const [selectedRate, setSelectedRate] = useState(null);
    const [calculatingRate, setCalculatingRate] = useState(false);
    const [rateCalculation, setRateCalculation] = useState(null);
    const [defaultItemValue, setDefaultItemValue] = useState('');
    const [basePrice, setBasePrice] = useState(0);
    const [weightPrice, setWeightPrice] = useState(0);
    const [pincodeLoading, setPincodeLoading] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);

    const [currentItem, setCurrentItem] = useState({
        name: '', quantity: 1, weight: '', value: '', length: '', breadth: '', height: '',
        hsCode: '', productType: '', category: 'General', images: [], imageFiles: [], imagePreviews: []
    });

    useEffect(() => {
        initData();
        const initialStates = State.getStatesOfCountry('IN');
        setStates(initialStates);
        setPickupStates(initialStates);
    }, []);

    // Use an effect that depends on both editOrder AND addresses to decide pickup mode
    useEffect(() => {
        if (editOrder) {
            console.log('Edit Order Initializing:', editOrder);

            // Handle consignee full name split Robustly
            const fullName = editOrder.consignee_name || editOrder.receiver_name || editOrder.name || '';
            const nameParts = fullName.trim().split(/\s+/);
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            const items = Array.isArray(editOrder.items) ? editOrder.items :
                (typeof editOrder.items === 'string' ? JSON.parse(editOrder.items || '[]') : []);

            // Check if we should show manual pickup address
            const hasId = !!editOrder.pickup_address_id;
            const idInList = addresses.some(a => String(a.id) === String(editOrder.pickup_address_id));
            const shouldShowManual = !hasId || (userRole === 'admin' && !idInList) || (!idInList && addresses.length > 0);

            // Exhaustive Fallbacks for Receiver / Consignee
            const mobile = editOrder.consignee_phone || editOrder.receiver_mobile || editOrder.mobile_number || editOrder.mobile || editOrder.phone || '';
            const email = editOrder.consignee_email || editOrder.receiver_email || editOrder.email || '';
            const addr1 = editOrder.consignee_address || editOrder.receiver_address || editOrder.address1 || editOrder.address || '';
            const city = editOrder.consignee_city || editOrder.receiver_city || editOrder.city || '';
            const state = editOrder.consignee_state || editOrder.receiver_state || editOrder.state || '';
            const pincode = editOrder.consignee_pincode || editOrder.receiver_pincode || editOrder.pincode || editOrder.zip || '';

            setFormData(prev => ({
                ...prev,
                pickupAddressId: editOrder.pickup_address_id ? String(editOrder.pickup_address_id) : '',
                isNewPickupAddress: shouldShowManual,
                newPickupAddress: {
                    name: editOrder.pickup_name || editOrder.sender_name || '',
                    mobile: editOrder.pickup_phone || editOrder.sender_phone || '',
                    address1: editOrder.pickup_address || editOrder.sender_address || '',
                    city: editOrder.pickup_city || editOrder.sender_city || '',
                    state: editOrder.pickup_state || editOrder.sender_state || '',
                    pincode: editOrder.pickup_pincode || editOrder.sender_pincode || ''
                },
                firstName: firstName,
                lastName: lastName,
                mobileNumber: mobile,
                email: email,
                country: editOrder.destination_country || editOrder.country || 'IN',
                address1: addr1,
                city: city,
                state: state,
                pincode: pincode,
                paymentMode: editOrder.payment_mode || editOrder.paymentMode || 'Prepaid',
                serviceType: editOrder.courierPartner || editOrder.serviceType || 'Express',
                items: items
            }));

            if (editOrder.courierPartner || editOrder.shippingCost || editOrder.shipping_cost) {
                const cost = parseFloat(editOrder.shipping_cost || editOrder.shippingCost || 0);
                setSelectedRate({
                    tierName: editOrder.courierPartner || editOrder.serviceType || 'Express',
                    estimatedCost: cost,
                    price: cost
                });
            }
        }
    }, [editOrder, addresses, userRole]);

    const initData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            fetchAddresses();
            fetchKYCData();
            fetchGatewayStatus();
            fetchUserProfile();

            const statsRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/stats.php`, config);
            if (statsRes.data?.user?.walletBalance) setWalletBalance(statsRes.data.user.walletBalance);
        } catch (e) { console.error('Init Error:', e); }
    };

    const fetchAddresses = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/addresses.php`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                const mapped = data.data.map(a => ({ ...a, _id: String(a.id) }));
                setAddresses(mapped);
                const def = mapped.find(a => a.isDefault == 1);
                if (!editOrder && def && !formData.pickupAddressId) {
                    setFormData(prev => ({ ...prev, pickupAddressId: String(def.id) }));
                }
            }
        } catch (e) { }
    };

    const fetchKYCData = async () => {
        setKycLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/status`, { // Changed to status endpoint for clarity
                headers: { Authorization: `Bearer ${token}` }
            });
            setKycAddress(data);
        } catch (e) { } finally { setKycLoading(false); }
    };

    const fetchGatewayStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/payment/gateway-status`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGatewayStatus(data);
        } catch (e) { }
    };


    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data) {
                if (data.role) setUserRole(data.role);
                if (!editOrder) {
                    setFormData(prev => ({ ...prev, firstName: data.firstname || '', lastName: data.lastname || '', mobileNumber: data.mobile || '', email: data.email || '' }));
                }
            }
        } catch (e) { }
    };

    const handlePincodeLookup = async (pin, isPickup = false) => {
        setPincodeLoading(true);
        try {
            const { data } = await axios.get(`https://api.postalpincode.in/pincode/${pin}`);
            if (data?.[0]?.Status === 'Success') {
                const po = data[0].PostOffice[0];
                const city = po.Division || po.District;
                const st = states.find(s => s.name.toLowerCase() === po.State.toLowerCase())?.isoCode || '';
                if (isPickup) setFormData(p => ({ ...p, newPickupAddress: { ...p.newPickupAddress, city, state: st } }));
                else setFormData(p => ({ ...p, city, state: st }));
            }
        } catch (e) { } finally { setPincodeLoading(false); }
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        if (currentItem.imageFiles.length + files.length > 4) return alert('Max 4 images allowed');
        const newFiles = [], newPreviews = [];
        for (const file of files) {
            if (!file.type.match(/image\/(jpeg|jpg|png)/)) continue;
            newFiles.push(file);
            const reader = new FileReader();
            reader.onload = () => {
                newPreviews.push(reader.result);
                if (newPreviews.length === newFiles.length) {
                    setCurrentItem(p => ({ ...p, imageFiles: [...p.imageFiles, ...newFiles], imagePreviews: [...p.imagePreviews, ...newPreviews] }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImages = async () => {
        if (currentItem.imageFiles.length === 0) return { success: true, urls: [] };
        try {
            const fd = new FormData();
            currentItem.imageFiles.forEach(f => fd.append('images', f));
            const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/orders/upload-images`, fd, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' }
            });
            return { success: true, urls: data.imageUrls || [] };
        } catch (e) { return { success: false, urls: [] }; }
    };

    const addItem = async () => {
        if (!currentItem.name || !currentItem.weight || !currentItem.value) return alert('Fill core item details');
        if (currentItem.imageFiles.length + currentItem.images.length < 2) return alert('Min 2 photos required');

        let urls = [...currentItem.images];
        if (currentItem.imageFiles.length > 0) {
            const res = await uploadImages();
            if (!res.success) return;
            urls = [...urls, ...res.urls];
        }

        setFormData(p => ({ ...p, items: [...p.items, { ...currentItem, images: urls }] }));
        setCurrentItem({ name: '', quantity: 1, weight: '', value: '', length: '', breadth: '', height: '', hsCode: '', productType: '', category: 'General', images: [], imageFiles: [], imagePreviews: [] });
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleSelectRate = (rate) => {
        setSelectedRate(rate);
        setCurrentStep(4);
    };

    const handleSubmit = async (paymentDetails = null, type = 'default') => {
        // PREVENT MULTIPLE CALLS
        if (loading || loadingLater || processingPayment || isSubmittingRef.current) {
            console.log('Submission Blocked: Already processing');
            return;
        }

        const isPayLater = type === 'PayLater';
        const isWallet = formData.paymentMode === 'Wallet';
        const isPrepaid = formData.paymentMode === 'Prepaid';

        if (!selectedRate) return alert('Please select a shipping service first');

        // Calculate total weight and amount WITH VALIDATION
        const totalWeight = formData.items.reduce((sum, item) => {
            const w = parseFloat(item.weight);
            return sum + (isNaN(w) ? 0 : w);
        }, 0);

        const baseCost = parseFloat(selectedRate.estimatedCost || selectedRate.price || 0);
        const shippingCost = isNaN(baseCost) ? 0 : baseCost;
        const totalAmount = shippingCost * 1.18; // 18% GST

        // Wallet balance check (only for Pay Wallet mode)
        if (!isPayLater && isWallet && walletBalance < totalAmount) {
            return alert(`Insufficient wallet balance. You need ₹${totalAmount.toFixed(2)} but have ₹${walletBalance.toFixed(2)}.`);
        }

        // If Pay Now is selected and no payment details yet, trigger Razorpay
        if (!isPayLater && isPrepaid && !paymentDetails) {
            setProcessingPayment(true);
            try {
                const loaded = await loadRazorpay();
                if (!loaded) {
                    setProcessingPayment(false);
                    return alert('Razorpay SDK failed to load. Please check your internet connection.');
                }

                const { data: order } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/payment/order.php`, {
                    amount: totalAmount,
                    currency: 'INR'
                }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

                const options = {
                    key: order.key,
                    amount: order.amount,
                    currency: order.currency,
                    name: "BGL Express",
                    description: "Shipment Creation",
                    order_id: order.id,
                    handler: function (response) {
                        setProcessingPayment(false);
                        // Small timeout to ensure states are settled before recursive call
                        setTimeout(() => handleSubmit(response), 100);
                    },
                    prefill: {
                        name: `${formData.firstName} ${formData.lastName}`.trim() || 'Valued Customer',
                        email: formData.email,
                        contact: formData.mobileNumber
                    },
                    theme: { color: "#2563eb" },
                    modal: {
                        ondismiss: function () {
                            setProcessingPayment(false);
                        }
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
                return; // Wait for handler
            } catch (error) {
                setProcessingPayment(false);
                return alert(error.response?.data?.message || 'Failed to initiate payment gateway.');
            }
        }

        // START SUBMISSION
        isSubmittingRef.current = true;
        if (isPayLater) setLoadingLater(true);
        else setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Resolve pickup address details
            const selectedAddress = addresses.find(a => String(a.id) === String(formData.pickupAddressId));
            const pickupDetails = selectedAddress ? {
                name: selectedAddress.name || '',
                phone: selectedAddress.phone || '',
                address: selectedAddress.address1 || '',
                city: selectedAddress.city || '',
                state: selectedAddress.state || '',
                pincode: selectedAddress.pincode || ''
            } : {};

            const payload = {
                pickupAddressId: formData.pickupAddressId,
                pickupDetails,
                consignee: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    mobile: formData.mobileNumber,
                    email: formData.email,
                    address1: formData.address1,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                    country: formData.country || 'India'
                },
                items: formData.items,
                paymentMode: isPayLater ? 'PayLater' : formData.paymentMode,
                courierPartner: selectedRate?.tierName || selectedRate?.name || 'Express',
                weight: totalWeight,
                deadWeight: totalWeight,
                // Status is critical - ensure it's one existing in backend or draft
                status: isPayLater ? 'pending_payment' : (isWallet || paymentDetails ? 'paid' : 'draft'),
                shippingCost: shippingCost,
                totalAmount: totalAmount,
                paymentId: paymentDetails?.razorpay_payment_id || null,
                paymentOrderId: paymentDetails?.razorpay_order_id || null,
                paymentSignature: paymentDetails?.razorpay_signature || null
            };

            let data;
            if (editOrder) {
                const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/shipment/update.php?id=${editOrder.id}`, payload, config);
                data = res.data;
            } else {
                const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/shipment/create.php`, payload, config);
                data = res.data;
            }

            if (data.success || data._id || data.id) {
                if (onSuccess) onSuccess();
                onClose();
            } else {
                throw new Error(data.message || 'Server returned an error');
            }

        } catch (e) {
            console.error('Submission Error:', e);
            alert(e.response?.data?.message || e.message || 'Internal logic error occurred.');
        } finally {
            setLoading(false);
            setLoadingLater(false);
            isSubmittingRef.current = false;
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('newAddress.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                newPickupAddress: { ...prev.newPickupAddress, [field]: value }
            }));
            if (field === 'pincode' && value.length === 6) handlePincodeLookup(value, true);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
            if (name === 'pincode' && value.length === 6) handlePincodeLookup(value);
        }
    };

    const handleItemChange = (e) => {
        const { name, value } = e.target;
        setCurrentItem(prev => ({ ...prev, [name]: value }));
    };

    const stepProps = {
        formData, setFormData, handleChange, handleItemChange, errors, setErrors, addresses, kycAddress, currentItem, setCurrentItem,
        handleImageChange, addItem, removeItem: (i) => setFormData(p => ({ ...p, items: p.items.filter((_, idx) => idx !== i) })),
        editItem: (i) => { const itm = formData.items[i]; setCurrentItem({ ...itm, imageFiles: [], imagePreviews: itm.images }); setFormData(p => ({ ...p, items: p.items.filter((_, idx) => idx !== i) })); },
        calculatingRate, rateCalculation, selectedRate, setSelectedRate, loading, loadingLater, processingPayment, handleSubmit, walletBalance,
        states, cities, pickupStates, pickupCities, pincodeLoading, handlePincodeLookup, setCurrentStep, handleSelectRate, onClose
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10 backdrop-blur-2xl bg-slate-900/60 transition-all duration-700">
            <div className="bg-[#F4F7FE] w-full max-w-7xl h-full max-h-[90vh] rounded-[48px] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)] border border-white/20 flex flex-col overflow-hidden animate-in zoom-in duration-500 font-sans">

                {/* Header (Matched to Image) */}
                <div className="px-12 py-10 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-50">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-slate-300">
                            <span className="text-red-500">Orders</span>
                            <ChevronRight className="w-3 h-3" />
                            <span>Create New</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tighter uppercase mt-2">
                            {editOrder ? 'Modify Order' : 'Add Order'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* System Workspace */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {kycLoading ? (
                        <div className="flex flex-col items-center justify-center p-20 space-y-4">
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                            <p className="text-slate-400 font-semibold uppercase tracking-widest text-[10px]">Verifying Security Access...</p>
                        </div>
                    ) : (kycAddress?.status !== 'verified' && userRole !== 'admin') ? (
                        <div className="max-w-2xl mx-auto p-12 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-24 h-24 bg-red-50 text-red-600 rounded-[32px] flex items-center justify-center mx-auto shadow-inner">
                                <ShieldAlert className="w-12 h-12" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">KYC Verification Required</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    Your account security protocol is currently incomplete. To unlock shipment creation modules, you must complete your KYC verification.
                                </p>
                            </div>

                            <div className={`p-6 rounded-3xl border transition-all duration-500 ${kycAddress?.status === 'pending'
                                ? 'bg-amber-50 border-amber-100 text-amber-800'
                                : kycAddress?.status === 'rejected'
                                    ? 'bg-red-50 border-red-100 text-red-800'
                                    : 'bg-blue-50 border-blue-100 text-blue-800'
                                }`}>
                                <div className="flex items-center gap-4 text-left">
                                    <Info className="w-6 h-6 shrink-0" />
                                    <div>
                                        <p className="font-bold text-sm uppercase tracking-tight">
                                            Current Status: {kycAddress?.status === 'pending' ? 'Verification In Progress' : kycAddress?.status === 'rejected' ? 'Rejected' : 'Not Submitted'}
                                        </p>
                                        {kycAddress?.rejectionReason && (
                                            <p className="text-xs mt-1 font-medium opacity-80">Reason: {kycAddress.rejectionReason}</p>
                                        )}
                                        <p className="text-xs mt-2 font-medium opacity-60">
                                            {kycAddress?.status === 'pending'
                                                ? "Our compliance team is reviewing your documents. Please wait 2-4 hours."
                                                : "Please complete your KYC profile to gain full system access."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-10 py-5 bg-white border border-slate-100 text-slate-400 rounded-3xl text-[10px] font-semibold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                                >
                                    Dismiss Module
                                </button>
                                {kycAddress?.status !== 'pending' && (
                                    <button
                                        onClick={() => {
                                            onClose();
                                            setActiveRoute('kyc');
                                        }}
                                        className="flex-1 px-10 py-5 bg-red-600 text-white rounded-3xl text-[10px] font-semibold uppercase tracking-widest hover:bg-black hover:shadow-2xl hover:shadow-red-900/40 transition-all shadow-xl shadow-red-200"
                                    >
                                        Initiate KYC Protocol
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 p-12">

                            {/* Primary Logic Flow */}
                            <div className="lg:col-span-3 space-y-12">
                                {currentStep === 1 && <StepConsigneeDetails {...stepProps} />}
                                {currentStep === 2 && <StepShipmentDetails {...stepProps} />}
                                {currentStep === 3 && <StepServiceSelection {...stepProps} />}
                                {currentStep === 4 && <StepPaymentSummary {...stepProps} />}

                                {/* Standard Navigation (Hidden on step 4 as it has its own matched buttons) */}
                                {currentStep < 4 && (
                                    <div className="flex items-center justify-between pt-12 border-t border-slate-200">
                                        {currentStep > 1 && (
                                            <button onClick={() => setCurrentStep(currentStep - 1)} className="px-10 py-5 bg-white border border-slate-100 text-slate-400 rounded-3xl text-[10px] font-semibold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm flex items-center gap-4 group">
                                                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Revert Protocol
                                            </button>
                                        )}
                                        <div className="flex-1" />
                                        <button onClick={() => currentStep < 4 ? setCurrentStep(currentStep + 1) : handleSubmit()} className="px-16 py-5 bg-red-600 text-white rounded-3xl text-[10px] font-semibold uppercase tracking-widest hover:bg-black hover:shadow-2xl hover:shadow-red-900/40 transition-all flex items-center gap-4 group">
                                            Next Sequence
                                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Intelligence Sidebar (Quick Tips Matched to Image) */}
                            <div className="lg:col-span-1 border-l border-slate-100 pl-12 space-y-10">
                                <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-200/20">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-10 shadow-inner">
                                            <Box className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-8">Quick Tips</h3>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-2">
                                            <p className="text-[11px] font-semibold text-slate-900 uppercase tracking-widest">Dead Weight:</p>
                                            <p className="text-[10px] font-medium text-slate-500 leading-relaxed">Dead weight (or dry weight) refers to the actual weight of the package in kg.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[11px] font-semibold text-slate-900 uppercase tracking-widest">Volumetric Weight: (L x W x H / 5000)</p>
                                            <p className="text-[10px] font-medium text-slate-500 leading-relaxed">Volumetric Weight is calculated based on the dimensions of the package.</p>
                                            <p className="text-[9px] text-slate-400 italic">The formula involves (Length x Width x Height) / 5000. Result is compared with dead weight.</p>
                                        </div>
                                        <div className="space-y-2 pt-4 border-t border-slate-50">
                                            <p className="text-[11px] font-semibold text-slate-900 uppercase tracking-widest">Additionally:</p>
                                            <p className="text-[10px] font-medium text-slate-500 leading-relaxed">The higher value between volumetric weight and dead weight will be used for calculation.</p>
                                            <p className="text-[9px] text-red-500 font-bold mt-2 uppercase">Final prices include fuel surcharges but exclude GST.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#1A1E2C] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl" />
                                    <div className="flex items-center gap-4 mb-8">
                                        <ShieldAlert className="w-5 h-5 text-red-500" />
                                        <p className="text-[10px] font-semibold uppercase tracking-widest">Network Protocol</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-medium text-white/40">Encryption</span>
                                            <span className="text-[10px] font-semibold text-green-400 uppercase">AES-256</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-medium text-white/40">Status</span>
                                            <span className="text-[10px] font-semibold text-blue-400 uppercase">Operational</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AddOrderModal;
