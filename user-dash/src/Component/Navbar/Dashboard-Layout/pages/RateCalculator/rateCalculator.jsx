import React, { useState, useEffect } from 'react';
import { RefreshCw, Calculator, Package, Info, ArrowRight } from 'lucide-react';
import axios from 'axios';

function RateCalculatorPage() {
    const [formData, setFormData] = useState({
        country: 'India',
        pincode: '',
        deadWeight: '',
        length: '',
        breadth: '',
        height: ''
    });
    const [loading, setLoading] = useState(false);
    const [rates, setRates] = useState(null);
    const [walletBalance, setWalletBalance] = useState(null);
    const [walletLoading, setWalletLoading] = useState(false);
    const [addAmount, setAddAmount] = useState('');
    const [processingAdd, setProcessingAdd] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [user, setUser] = useState(null);

    // Fetch user profile on mount
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/profile`, config);
            setUser(data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    // Fetch wallet balance on mount
    useEffect(() => {
        fetchWalletBalance();
    }, []);

    const fetchWalletBalance = async () => {
        try {
            setWalletLoading(true);
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/payment/wallet/balance`, config);
            setWalletBalance(data.balance);
        } catch (error) {
            console.error('Wallet fetch error:', error);
        } finally {
            setWalletLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            country: 'India',
            pincode: '',
            deadWeight: '',
            length: '',
            breadth: '',
            height: ''
        });
        setRates(null);
        setAddAmount('');
    };

    const handleAddToWallet = async () => {
        const numericAmount = Number(addAmount);
        if (!numericAmount || !Number.isFinite(numericAmount) || numericAmount <= 0) {
            alert('Please enter a valid amount to add to wallet.');
            return;
        }

        setProcessingAdd(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // User Info for PayU
            const firstName = user?.firstname || user?.name?.split(' ')[0] || 'Customer';
            const email = user?.email || 'customer@example.com';
            const phone = user?.mobile || user?.phone || '9999999999';

            // Create payment order via backend (PayU)
            const { data: orderData } = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/payment/order`,
                {
                    gateway: 'payu',
                    amount: Number(numericAmount.toFixed(2)),
                    currency: 'INR',
                    receipt: `wallet_${Date.now()}`,
                    customerInfo: {
                        productInfo: 'Wallet Recharge',
                        firstName: firstName,
                        email: email,
                        phone: phone,
                        udf1: '',
                        udf2: '',
                        udf3: '',
                        udf4: '',
                        udf5: ''
                    }
                },
                config
            );

            // Build and submit PayU form
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = orderData.paymentUrl;

            const fields = {
                key: orderData.merchantKey,
                txnid: orderData.txnid,
                amount: orderData.amount,
                productinfo: orderData.productInfo,
                firstname: orderData.firstName,
                email: orderData.email,
                phone: orderData.phone,
                surl: orderData.surl,
                furl: orderData.furl,
                hash: orderData.hash,
                udf1: orderData.udf1 || '',
                udf2: orderData.udf2 || '',
                udf3: orderData.udf3 || '',
                udf4: orderData.udf4 || '',
                udf5: orderData.udf5 || ''
            };

            Object.keys(fields).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = fields[key];
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();

        } catch (error) {
            console.error('Payment Error:', error);
            alert(error.response?.data?.message || 'Failed to initiate wallet payment.');
            setProcessingAdd(false);
        }
    };

    const handleCalculate = async () => {
        if (!formData.deadWeight || !formData.country) {
            alert('Please fill in required fields (Country and Dead Weight)');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const { data } = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/rate/calculate`,
                {
                    destinationCountry: formData.country,
                    deadWeight: parseFloat(formData.deadWeight),
                    length: formData.length ? parseFloat(formData.length) : undefined,
                    breadth: formData.breadth ? parseFloat(formData.breadth) : undefined,
                    height: formData.height ? parseFloat(formData.height) : undefined,
                    pincode: formData.pincode || undefined
                },
                config
            );

            if (data.offers && data.offers.length > 0) {
                // Show the cheapest option by default
                const cheapestOffer = data.offers[0];
                setRates({
                    offers: data.offers,
                    chargeableWeight: data.chargeableWeight,
                    deadWeight: data.deadWeight,
                    volumetricWeight: data.volumetricWeight,
                    selectedOffer: cheapestOffer
                });
            } else {
                alert(data.message || 'No rates available for this configuration. Please contact support.');
                setRates(null);
            }
        } catch (error) {
            console.error('Rate calculation error:', error);
            alert(error.response?.data?.message || 'Failed to calculate rate. Please try again.');
            setRates(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 lg:p-6 bg-gray-50 dark:bg-gray-950 min-h-full">
            <div className="flex flex-col gap-4 mb-6">

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Wallet Balance</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {walletLoading ? 'Loading...' : `₹${walletBalance !== null ? walletBalance : '0.00'}`}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <input
                            type="number"
                            value={addAmount}
                            onChange={(e) => setAddAmount(e.target.value)}
                            placeholder="Add amount"
                            className="w-full sm:w-48 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                        <button
                            onClick={handleAddToWallet}
                            disabled={processingAdd}
                            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {processingAdd ? 'Processing...' : 'Add to Wallet'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calculator Form */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Country */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Destination Country <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none"
                            >
                                <option value="India">India</option>
                                <option value="USA">United States</option>
                                <option value="UK">United Kingdom</option>
                                <option value="UAE">UAE</option>
                            </select>
                        </div>

                        {/* Pincode */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Destination Pincode
                            </label>
                            <input
                                type="text"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                placeholder="Enter Destination Pincode..."
                                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 -mt-4 mb-6">
                        Add destination postcode for accurate pricing and shippers.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        {/* Dead Weight */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Dead Weight <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="deadWeight"
                                    value={formData.deadWeight}
                                    onChange={handleChange}
                                    placeholder="Eg. 1.25"
                                    className="w-full pl-4 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">kg</span>
                            </div>
                        </div>

                        {/* Dimensions */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Length</label>
                            <div className="relative">
                                <input type="number" name="length" value={formData.length} onChange={handleChange} placeholder="Eg. 10" className="w-full pl-4 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">cm</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Breadth</label>
                            <div className="relative">
                                <input type="number" name="breadth" value={formData.breadth} onChange={handleChange} placeholder="Eg. 10" className="w-full pl-4 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">cm</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Height</label>
                            <div className="relative">
                                <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="Eg. 10" className="w-full pl-4 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">cm</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={handleReset}
                            className="px-6 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium transition-colors flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reset
                        </button>
                        <button
                            onClick={handleCalculate}
                            disabled={loading}
                            className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                                <Calculator className="w-4 h-4" />
                            )}
                            Calculate
                        </button>
                    </div>

                    {rates && (
                        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800 animate-fadeIn">
                            {/* Weight Summary */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Weight Calculation</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Dead Weight:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{rates.deadWeight} kg</span>
                                    </div>
                                    {rates.volumetricWeight > 0 && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Volumetric Weight:</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{rates.volumetricWeight} kg</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <span className="font-semibold text-gray-900 dark:text-white">Chargeable Weight:</span>
                                        <span className="font-bold text-blue-600 dark:text-blue-400">{rates.chargeableWeight} kg</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rate Offers */}
                            {rates.offers && rates.offers.length > 0 ? (
                                <div className="space-y-3">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-3">Available Rates</h3>
                                    {rates.offers.map((offer, idx) => (
                                        <div
                                            key={idx}
                                            className={`bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border-2 transition-all ${rates.selectedOffer?.courier === offer.courier
                                                ? 'border-blue-500 dark:border-blue-400'
                                                : 'border-blue-100 dark:border-blue-800'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-bold text-blue-900 dark:text-blue-300">{offer.courier}</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">{offer.deliveryDays}</p>
                                                    {offer.rating && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <span className="text-xs text-yellow-600 dark:text-yellow-400">★</span>
                                                            <span className="text-xs text-gray-600 dark:text-gray-400">{offer.rating}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{offer.estimatedCost}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                                    <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Estimated Rate</h3>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {rates.selectedOffer?.courier || 'N/A'}
                                        </span>
                                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            ₹{rates.selectedOffer?.estimatedCost || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Quick Tips Panel */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm h-fit">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">Quick Tips</h3>

                    <div className="flex justify-center mb-8">
                        <div className="w-40 h-32 relative">
                            {/* Styling a Box using CSS or SVG if possible, using Package Icon for simplicity but scaled up */}
                            <Package strokeWidth={1} className="w-full h-full text-amber-600/80" />
                            {/* Arrows placeholders - conceptual */}
                            <div className="absolute -right-2 top-1/2 -translate-y-1/2 font-mono text-xs text-gray-500 font-bold">H</div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 font-mono text-xs text-gray-500 font-bold">L</div>
                            <div className="absolute right-0 bottom-2 translate-x-2 font-mono text-xs text-gray-500 font-bold">B</div>
                        </div>
                    </div>

                    <div className="space-y-4 text-sm">
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-1">Dead Weight:</h4>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Dead weight (or dry weight) refers to the actual weight of the package in kilograms.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-1">Volumetric Weight: (L x W x H / 5000)</h4>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Volumetric Weight (or DIM weight) is calculated based on the dimensions of the package.
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                                The formula for calculating volumetric weight involves multiplying the length, width, and height of the package and then dividing by 5000.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                            <h4 className="font-bold text-gray-900 dark:text-white mb-1">Additionally:</h4>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                The higher value between volumetric weight and dead weight will be used for freight rate calculation.
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 mt-2 text-xs">
                                Prices are subject to change based on fuel surcharges and courier company base rates.
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs">
                                The above prices exclude GST.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RateCalculatorPage;
