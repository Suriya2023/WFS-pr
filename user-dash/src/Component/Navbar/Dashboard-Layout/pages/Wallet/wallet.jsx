import React, { useState, useEffect } from 'react';
import { Wallet, X, MoreHorizontal, Filter, Download, Eye, ArrowUpRight, ArrowDownLeft, CreditCard, Loader2 } from 'lucide-react';
import axios from 'axios';
// import { io } from 'socket.io-client';

// const socket = io(import.meta.env.VITE_API_BASE_URL);

function WalletPage({ showRechargeModal, setShowRechargeModal, refreshGlobalUserData }) {
    const [activeTab, setActiveTab] = useState('history'); // 'history' or 'recharge'
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    // Recharge State
    const [rechargeAmount, setRechargeAmount] = useState('');
    const [selectedPayment, setSelectedPayment] = useState('payu');
    const [gatewayStatus, setGatewayStatus] = useState(null);
    const [processingRecharge, setProcessingRecharge] = useState(false);

    // Fetch user profile data
    useEffect(() => {
        fetchUserProfile();
        fetchGatewayStatus();

        /* 
        // Socket Listener for live gateway updates
        socket.on('gateway_status_changed', (data) => {
            console.log('[Socket] Wallet: Gateway status updated live', data);
            fetchGatewayStatus();
        });

        return () => {
            socket.off('gateway_status_changed');
        };
        */
    }, []);

    const fetchGatewayStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/payment/gateway-status`, config);
            setGatewayStatus(response.data);
            // Set default gateway based on what's active
            if (response.data.activeGateway) {
                setSelectedPayment(response.data.activeGateway);
            } else if (response.data.availableGateways?.length > 0) {
                setSelectedPayment(response.data.availableGateways[0].code);
            }
        } catch (error) {
            console.error('Error fetching gateway status:', error);
        }
    };

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

    // Fetch transaction history
    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/wallet/history`, config);

            // Ensure data is always an array
            if (Array.isArray(data)) {
                setTransactions(data);
            } else if (data && Array.isArray(data.transactions)) {
                setTransactions(data.transactions);
            } else if (data && Array.isArray(data.data)) {
                setTransactions(data.data);
            } else {
                console.warn('Unexpected data format from API:', data);
                setTransactions([]);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = activeTab === 'recharge'
        ? (Array.isArray(transactions) ? transactions.filter(t => t.type === 'credit') : [])
        : (Array.isArray(transactions) ? transactions : []);

    const handleProceedPayment = async () => {
        if (processingRecharge) return; // prevent double-click
        if (!rechargeAmount || rechargeAmount <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        setProcessingRecharge(true);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const orderUrl = `${import.meta.env.VITE_API_BASE_URL}/api/payment/order`;

            // Use actual user data for customer info
            const firstName = user?.firstname || (user?.name?.split(' ')[0]) || 'Customer';
            const email = user?.email || 'customer@example.com';
            const phone = user?.mobile || user?.phone || '9999999999';

            // Selected Gateway
            const { data: orderData } = await axios.post(orderUrl, {
                gateway: selectedPayment,
                amount: Number(rechargeAmount),
                currency: "INR",
                receipt: "wallet_" + Date.now(),
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
            }, config);

            // Flow based on gateway
            if (selectedPayment === 'razorpay') {
                const options = {
                    key: orderData.key,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: 'BGL Express',
                    description: 'Wallet Recharge',
                    order_id: orderData.id,
                    handler: async function (response) {
                        try {
                            const verifyUrl = `${import.meta.env.VITE_API_BASE_URL}/api/payment/verify`;
                            await axios.post(verifyUrl, {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                walletRecharge: true
                            }, config);

                            setShowRechargeModal(false);
                            fetchTransactions();
                            fetchUserProfile();
                            if (refreshGlobalUserData) refreshGlobalUserData();
                            alert('Wallet recharged successfully!');
                        } catch (err) {
                            alert('Payment verification failed. Please contact support.');
                        }
                    },
                    prefill: {
                        name: firstName,
                        email: email,
                        contact: phone
                    },
                    theme: {
                        color: "#1e40af"
                    }
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
            } else if (selectedPayment === 'payu') {
                // Build and submit PayU form (redirect flow)
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
            }

        } catch (error) {
            console.error("Payment Error:", error);
            alert(error.response?.data?.message || "Failed to initiate payment.");
        } finally {
            setProcessingRecharge(false);
        }
    };

    return (
        <div className="p-4 lg:p-6 bg-gray-50 dark:bg-gray-950 min-h-full">
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
                <div className="flex gap-8 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`pb-3 text-sm font-semibold transition-colors whitespace-nowrap relative ${activeTab === 'history'
                            ? 'text-gray-900 dark:text-white border-b-2 border-black dark:border-white'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        Transaction History
                    </button>
                    <button
                        onClick={() => setActiveTab('recharge')}
                        className={`pb-3 text-sm font-semibold transition-colors whitespace-nowrap relative ${activeTab === 'recharge'
                            ? 'text-gray-900 dark:text-white border-b-2 border-black dark:border-white'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        Recharge History
                    </button>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm font-medium">
                            <Filter className="w-4 h-4" />
                            More Filters
                        </button>
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-sm font-medium">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>

                    <button
                        onClick={() => setShowRechargeModal(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-800 text-white px-5 py-2 rounded-lg hover:bg-blue-900 transition-colors font-medium shadow-sm"
                    >
                        <Wallet className="w-4 h-4" />
                        Recharge Wallet
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4 w-12">
                                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                </th>
                                <th className="px-6 py-4">Transaction Date</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">View Detail</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-32 text-center text-gray-500">
                                        <div className="flex justify-center items-center">
                                            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                            </svg>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-32 text-center text-gray-500">
                                        No Records
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map(tx => (
                                    <tr key={tx._id || tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4"><input type="checkbox" className="rounded" /></td>
                                        <td className="px-6 py-4 text-gray-900 dark:text-white">
                                            {new Date(tx.created_at || tx.createdAt).toLocaleDateString('en-IN')}
                                            <br />
                                            <span className="text-xs text-gray-500">
                                                {new Date(tx.created_at || tx.createdAt).toLocaleTimeString('en-IN')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900 dark:text-white">{tx.description}</div>
                                            {tx.referenceId && (
                                                <div className="text-xs text-gray-500 font-mono">{tx.referenceId}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-semibold ${tx.status === 'success' ? 'text-green-600' : (tx.type === 'credit' ? 'text-green-600' : 'text-red-600')}`}>
                                                {tx.type === 'credit' ? '+' : '-'}₹{Math.round(tx.amount)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${tx.status === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recharge Modal (Preserved & Styled) */}
            {showRechargeModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl relative border border-gray-200 dark:border-gray-800">
                        <button
                            onClick={() => setShowRechargeModal(false)}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>

                        <div className="p-6">
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                    <Wallet className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-center mb-1 dark:text-white">Add Funds</h2>
                            <p className="text-center text-gray-500 text-sm mb-6">Recharge your wallet securely</p>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                                        <input
                                            type="number"
                                            value={rechargeAmount}
                                            onChange={(e) => setRechargeAmount(e.target.value)}
                                            placeholder="Enter amount"
                                            className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {[100, 500, 1000, 2000, 5000].map(amount => (
                                        <button
                                            key={amount}
                                            type="button"
                                            onClick={() => setRechargeAmount(amount.toString())}
                                            className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-600 dark:text-gray-300 transition-colors"
                                        >
                                            ₹{amount}
                                        </button>
                                    ))}
                                </div>

                                {/* Dynamic Payment Gateway Selection */}
                                <div className="space-y-3 pt-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Payment Method</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {gatewayStatus?.availableGateways?.map((gw) => (
                                            <div
                                                key={gw.code}
                                                onClick={() => setSelectedPayment(gw.code)}
                                                className={`flex items-center justify-between p-3 border-2 rounded-xl cursor-pointer transition-all ${selectedPayment === gw.code
                                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                                                    : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPayment === gw.code ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                                                        }`}>
                                                        {selectedPayment === gw.code && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                                                            {gw.name || gw.code}
                                                        </p>
                                                        <p className="text-[10px] text-gray-500 uppercase tracking-tighter">
                                                            {gw.mode} Mode Active
                                                        </p>
                                                    </div>
                                                </div>
                                                <CreditCard className={`w-5 h-5 ${selectedPayment === gw.code ? 'text-blue-600' : 'text-gray-400'}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleProceedPayment}
                                    disabled={!rechargeAmount || processingRecharge}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2 active:scale-[0.98]"
                                >
                                    {processingRecharge ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <span>Proceed to Pay ₹{rechargeAmount || '0'}</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WalletPage;