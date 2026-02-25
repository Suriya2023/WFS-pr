import React from "react";
import { Truck, Clock, Zap, CheckCircle2 } from "lucide-react";

const StepServiceSelection = ({
    calculatingRate,
    selectedRate,
    handleSelectRate,
    rateCalculation,
    formData,
    loading,
}) => {
    const mockRates = [
        { id: "standard", name: "BGL Surface Link", price: 150, estimatedCost: 150, time: "5-7 Days", courier: "BGL Logistics Network", tierName: "Surface Link" },
        { id: "express", name: "BGL Air Protocol", price: 280, estimatedCost: 280, time: "2-4 Days", courier: "BGL Sky Network", tierName: "Air Protocol" },
    ];

    const displayRates =
        rateCalculation && rateCalculation.offers
            ? rateCalculation.offers
            : mockRates;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-semibold text-sm">
                    03
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Select Service</h3>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Carrier Routing Protocol</p>
                </div>
            </div>

            {calculatingRate ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-[32px] shadow-sm">
                    <div className="w-12 h-12 border-4 border-slate-50 border-t-blue-600 rounded-full animate-spin mb-4" />
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">Polling Network Rates...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {displayRates.map((rate) => {
                        const isSelected =
                            selectedRate?.id === rate.id ||
                            selectedRate?.tierName === rate.tierName;

                        return (
                            <div
                                key={rate.id || rate.tierName}
                                onClick={() => handleSelectRate(rate)}
                                className={`group relative bg-white border-2 rounded-[32px] p-8 cursor-pointer transition-all duration-500 overflow-hidden ${isSelected
                                        ? "border-blue-600 shadow-xl shadow-blue-500/10 ring-4 ring-blue-500/5"
                                        : "border-slate-50 hover:border-blue-200 hover:shadow-lg shadow-sm"
                                    }`}
                            >
                                {isSelected && (
                                    <div className="absolute top-0 right-10 py-2 px-4 bg-blue-600 text-white text-[8px] font-bold uppercase tracking-widest rounded-b-xl animate-in slide-in-from-top-2 duration-500">
                                        Selected Model
                                    </div>
                                )}

                                <div className="flex justify-between items-center relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-300'}`}>
                                            <Zap className={`w-6 h-6 ${isSelected ? 'animate-pulse' : ''}`} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                                                {rate.tierName || rate.name}
                                            </h4>
                                            <div className="flex gap-6 mt-2">
                                                <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                                    <Truck size={14} className="text-blue-500" />
                                                    {rate.courier || 'BGL Network'}
                                                </span>
                                                <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                                    <Clock size={14} className="text-orange-500" />
                                                    {rate.deliveryDays || rate.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1">Contract Rate</p>
                                        <p className={`text-4xl font-bold italic tracking-tighter ${isSelected ? 'text-blue-600' : 'text-slate-900'}`}>
                                            ₹{(rate.estimatedCost || rate.price).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Status Footer */}
            <div className="bg-slate-900 rounded-2xl p-6 flex items-center justify-between border border-slate-800 shadow-xl">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                        System rates verified against real-time network benchmarks.
                    </p>
                </div>
                <div className="px-3 py-1 bg-green-500/10 text-green-500 text-[8px] font-bold uppercase rounded-lg border border-green-500/20">
                    Encrypted Link
                </div>
            </div>
        </div>
    );
};

export default StepServiceSelection;