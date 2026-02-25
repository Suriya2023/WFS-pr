import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle } from 'lucide-react';

function PaymentFailure() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [paymentDetails, setPaymentDetails] = useState(null);

    useEffect(() => {
        // Get PayU failure response parameters
        const txnid = searchParams.get('txnid');
        const amount = searchParams.get('amount');
        const productInfo = searchParams.get('productinfo');
        const status = searchParams.get('status');
        const error = searchParams.get('error');
        const error_Message = searchParams.get('error_Message');

        setPaymentDetails({
            transactionId: txnid,
            amount,
            productInfo,
            status,
            errorMessage: error_Message || error || 'Payment failed'
        });
    }, [searchParams]);

    const handleRetry = () => {
        // Determine where to redirect based on product info
        if (paymentDetails?.productInfo && paymentDetails.productInfo.toLowerCase().includes('wallet')) {
            navigate('/home?tab=wallet&action=recharge');
        } else {
            navigate('/home?tab=orders&action=create');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-10 h-10 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Payment Failed
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {paymentDetails?.errorMessage || 'Your payment could not be processed. Please try again.'}
                </p>

                {paymentDetails && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left">
                        <div className="space-y-2 text-sm">
                            {paymentDetails.transactionId && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{paymentDetails.transactionId}</span>
                                </div>
                            )}
                            {paymentDetails.amount && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">₹{paymentDetails.amount}</span>
                                </div>
                            )}
                            {paymentDetails.productInfo && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Description:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{paymentDetails.productInfo}</span>
                                </div>
                            )}
                            {paymentDetails.status && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                                    <span className="font-medium text-red-600">{paymentDetails.status}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/home')}
                        className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors"
                    >
                        Go to Dashboard
                    </button>
                    <button
                        onClick={handleRetry}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentFailure;
