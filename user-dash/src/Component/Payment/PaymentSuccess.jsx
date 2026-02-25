import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(true);
    const [error, setError] = useState(null);
    const [paymentDetails, setPaymentDetails] = useState(null);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Get all PayU response parameters
                const txnid = searchParams.get('txnid');
                const amount = searchParams.get('amount');
                const productInfo = searchParams.get('productinfo');
                const firstName = searchParams.get('firstname');
                const email = searchParams.get('email');
                const status = searchParams.get('status');
                const hash = searchParams.get('hash');
                const mihpayid = searchParams.get('mihpayid');

                // UDF fields
                const udf1 = searchParams.get('udf1') || '';
                const udf2 = searchParams.get('udf2') || '';
                const udf3 = searchParams.get('udf3') || '';
                const udf4 = searchParams.get('udf4') || '';
                const udf5 = searchParams.get('udf5') || '';

                if (!txnid || !status) {
                    throw new Error('Invalid payment response');
                }

                // Verify payment with backend
                const verifyResponse = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/api/payment/verify`,
                    {
                        gateway: 'payu',
                        txnid,
                        amount,
                        productInfo,
                        firstName,
                        email,
                        status,
                        hash,
                        udf1,
                        udf2,
                        udf3,
                        udf4,
                        udf5
                    },
                    config
                );

                if (verifyResponse.data.success) {
                    // Wallet recharge is now handled securely on the backend during verification
                    // We just need to update UI/State or Redirect

                    setPaymentDetails({
                        transactionId: mihpayid || txnid,
                        amount,
                        productInfo,
                        status: 'success'
                    });
                    setProcessing(false);


                    // Redirect after 3 seconds
                    setTimeout(() => {
                        if (productInfo && productInfo.toLowerCase().includes('wallet')) {
                            navigate('/home?tab=wallet');
                        } else {
                            navigate('/home?tab=orders');
                        }
                    }, 3000);
                } else {
                    throw new Error('Payment verification failed');
                }
            } catch (err) {
                console.error('Payment verification error:', err);
                setError(err.response?.data?.message || err.message || 'Payment verification failed');
                setProcessing(false);
            }
        };

        verifyPayment();
    }, [searchParams, navigate]);

    if (processing) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Verifying Payment
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Please wait while we confirm your payment...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Verification Failed
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {error}
                    </p>
                    <button
                        onClick={() => navigate('/home')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Payment Successful!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Your payment has been processed successfully.
                </p>

                {paymentDetails && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{paymentDetails.transactionId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                                <span className="font-medium text-gray-900 dark:text-white">₹{paymentDetails.amount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Description:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{paymentDetails.productInfo}</span>
                            </div>
                        </div>
                    </div>
                )}

                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Redirecting to dashboard in 3 seconds...
                </p>
            </div>
        </div>
    );
}

export default PaymentSuccess;
