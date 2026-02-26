import React from 'react';
import { CreditCard, Loader2, CheckCircle2, Wallet, Info, ChevronRight, Package, CreditCard as CardIcon } from 'lucide-react';

const StepPaymentSummary = ({
    formData,
    setFormData,
    selectedRate,
    loading,
    loadingLater,
    processingPayment,
    handleSubmit,
    setCurrentStep,
    onClose,
    canEdit,
}) => {
    // Calculate totals based on the image logic (18% split into CGST/SGST)
    const shippingCost = selectedRate ? (selectedRate.estimatedCost || selectedRate.price || 0) : 0;
    const cgst = (shippingCost * 0.09);
    const sgst = (shippingCost * 0.09);
    const totalAmount = shippingCost + cgst + sgst;

    const setPaymentMode = (mode) => {
        if (!canEdit) return;
        setFormData(prev => ({ ...prev, paymentMode: mode }));
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Payment Header */}
            <div className="flex items-start gap-5">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                        {canEdit ? 'Complete Payment' : 'Verification Locked'}
                    </h3>
                    <p className="text-sm font-medium text-slate-400">
                        {canEdit
                            ? 'Order created successfully! Please complete the payment to proceed.'
                            : 'This order has been verified by the administration and can no longer be modified.'}
                    </p>
                </div>
            </div>

            {/* Invoice Summary Box */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-10 shadow-sm space-y-6">
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium text-slate-500">Shipping Cost:</span>
                        <span className="text-sm font-bold text-slate-900">₹{shippingCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium text-slate-500">CGST (9%):</span>
                        <span className="text-sm font-bold text-slate-900">₹{cgst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium text-slate-500">SGST (9%):</span>
                        <span className="text-sm font-bold text-slate-900">₹{sgst.toFixed(2)}</span>
                    </div>
                    <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                        <span className="text-lg font-bold text-slate-900">Total Amount:</span>
                        <span className="text-3xl font-bold text-blue-600">₹{totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-4">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest ml-1">Select Payment Method</p>
                <div className="grid grid-cols-2 gap-6">
                    <button
                        onClick={() => setPaymentMode('Prepaid')}
                        disabled={!canEdit}
                        className={`group relative p-8 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-3 ${formData.paymentMode === 'Prepaid' ? 'border-blue-600 bg-blue-50/20' : 'border-slate-100 bg-white hover:border-slate-200'} ${!canEdit && 'opacity-50 cursor-not-allowed'}`}
                    >
                        <span className="text-lg font-bold text-slate-900">Pay Now</span>
                        <div className="px-3 py-1 bg-green-50 text-green-600 text-[8px] font-bold uppercase rounded-lg border border-green-100">Fast & Secure</div>
                        {formData.paymentMode === 'Prepaid' && <div className="absolute top-4 right-4"><CheckCircle2 className="w-4 h-4 text-blue-600" /></div>}
                    </button>
                    <button
                        onClick={() => setPaymentMode('Wallet')}
                        disabled={!canEdit}
                        className={`group relative p-8 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-3 ${formData.paymentMode === 'Wallet' ? 'border-blue-600 bg-blue-50/20' : 'border-slate-100 bg-white hover:border-slate-200'} ${!canEdit && 'opacity-50 cursor-not-allowed'}`}
                    >
                        <span className="text-lg font-bold text-slate-900">Pay Wallet</span>
                        <div className="px-3 py-1 bg-green-50 text-green-600 text-[8px] font-bold uppercase rounded-lg border border-green-100">Fast & Secure</div>
                        {formData.paymentMode === 'Wallet' && <div className="absolute top-4 right-4"><CheckCircle2 className="w-4 h-4 text-blue-600" /></div>}
                    </button>
                </div>
            </div>

            {/* Action Buttons Footer */}
            <div className="flex items-center gap-6 pt-10">
                <button
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                >
                    Back
                </button>
                {canEdit && (
                    <>
                        <button
                            onClick={() => handleSubmit(null, 'PayLater')}
                            disabled={loading || loadingLater || processingPayment}
                            className={`flex-1 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-sm ${loadingLater
                                ? 'bg-amber-100 text-amber-500 cursor-wait'
                                : (loading || processingPayment ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-amber-50 border-2 border-amber-200 text-amber-700 hover:bg-amber-100 active:scale-95')
                                }`}
                        >
                            {loadingLater ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-amber-600" /> : '⏳ Pay Later'}
                        </button>
                        <button
                            onClick={() => handleSubmit()}
                            disabled={loading || loadingLater || processingPayment || !formData.paymentMode}
                            className={`flex-[1.5] py-5 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 ${(loading || processingPayment)
                                ? 'bg-blue-400 text-white/70 cursor-wait'
                                : (loadingLater || !formData.paymentMode ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-blue-500/30')
                                }`}
                        >
                            {loading || processingPayment ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <CardIcon className="w-5 h-5" />
                                    {formData.paymentMode === 'Wallet' ? 'Pay via Wallet' : 'Pay Now'}
                                </>
                            )}
                        </button>
                    </>
                )}
                {!canEdit && (
                    <button
                        onClick={onClose}
                        className="flex-[1.5] py-5 rounded-2xl font-bold text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-black transition-all shadow-xl"
                    >
                        Dismiss Viewer
                    </button>
                )}
            </div>
        </div>
    );
};

export default StepPaymentSummary;
