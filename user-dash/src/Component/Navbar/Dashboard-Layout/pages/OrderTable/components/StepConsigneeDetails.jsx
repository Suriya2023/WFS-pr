import React from "react";
import { MapPin, Pencil, Navigation, User, Phone, Mail, Globe, Search } from "lucide-react";

const StepConsigneeDetails = ({
    formData,
    addresses,
    kycAddress,
    handleChange,
    setFormData,
    handleEditAddress,
    errors = {},
    states = [],
    pickupStates = [],
    pincodeLoading = false,
    canEdit = true,
}) => {
    return (
        <div className={`space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700 ${!canEdit ? 'pointer-events-none opacity-80' : ''}`}>

            {/* Header section (Subtle) */}
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-semibold text-sm">
                    01
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Consignee Details</h3>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Origin & Destination Protocol</p>
                </div>
            </div>

            {/* Pickup Address Hub */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Navigation className="w-4 h-4 text-red-500" />
                        <span className="text-[11px] font-semibold text-slate-900 uppercase tracking-widest">Pickup Origin</span>
                    </div>
                    <button
                        onClick={() => setFormData(p => ({ ...p, isNewPickupAddress: !p.isNewPickupAddress }))}
                        className="text-[10px] font-bold text-blue-600 uppercase hover:underline"
                    >
                        {formData.isNewPickupAddress ? 'Use Saved Address' : '+ Add New Address'}
                    </button>
                </div>

                {!formData.isNewPickupAddress ? (
                    <div className="relative group">
                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-red-500 transition-colors" />
                        <select
                            name="pickupAddressId"
                            value={formData.pickupAddressId}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-4 text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500/20 transition-all appearance-none cursor-pointer"
                        >
                            <option value="">Select Protocol Node (Address)</option>
                            {addresses.map((addr) => (
                                <option key={addr._id} value={addr._id}>
                                    {addr.name} — {addr.city}, {addr.pincode}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in zoom-in duration-300">
                        <input
                            name="newAddress.name"
                            value={formData.newPickupAddress.name}
                            onChange={handleChange}
                            placeholder="Full Name *"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3.5 text-xs font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                        />
                        <input
                            name="newAddress.mobile"
                            value={formData.newPickupAddress.mobile}
                            onChange={handleChange}
                            placeholder="Mobile No. *"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3.5 text-xs font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                        />
                        <input
                            name="newAddress.address1"
                            value={formData.newPickupAddress.address1}
                            onChange={handleChange}
                            placeholder="Flat, House no., Building, Company, Apartment *"
                            className="col-span-2 w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3.5 text-xs font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                        />
                        <div className="relative">
                            <input
                                name="newAddress.pincode"
                                value={formData.newPickupAddress.pincode}
                                onChange={handleChange}
                                placeholder="Pincode *"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3.5 text-xs font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                            />
                            {pincodeLoading && <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 animate-pulse" />}
                        </div>
                        <select
                            name="newAddress.state"
                            value={formData.newPickupAddress.state}
                            onChange={handleChange}
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3.5 text-xs font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                        >
                            <option value="">Select State</option>
                            {pickupStates.map((s) => (
                                <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                            ))}
                        </select>
                        <input
                            name="newAddress.city"
                            value={formData.newPickupAddress.city}
                            onChange={handleChange}
                            placeholder="City *"
                            className="col-span-2 w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3.5 text-xs font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                        />
                    </div>
                )}
            </div>

            {/* Buyer/Receiver Details */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-8 space-y-8 shadow-sm">
                <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span className="text-[11px] font-semibold text-slate-900 uppercase tracking-widest">Target Destination (Receiver)</span>
                </div>

                {/* Identity Matrix */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                        <div className="relative group">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Elon"
                                className={`w-full bg-slate-50 border rounded-2xl pl-14 pr-6 py-4 text-sm font-medium outline-none transition-all ${errors.firstName ? 'border-red-500 bg-red-50/50' : 'border-slate-100 focus:ring-4 focus:ring-blue-500/5'}`}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                        <input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Musk"
                            className={`w-full bg-slate-50 border rounded-2xl px-6 py-4 text-sm font-medium outline-none transition-all ${errors.lastName ? 'border-red-500 bg-red-50/50' : 'border-slate-100 focus:ring-4 focus:ring-blue-500/5'}`}
                        />
                    </div>
                </div>

                {/* Contact Matrix */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mobile Access</label>
                        <div className="relative group">
                            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                placeholder="9876543210"
                                className={`w-full bg-slate-50 border rounded-2xl pl-14 pr-6 py-4 text-sm font-medium outline-none transition-all ${errors.mobileNumber ? 'border-red-500 bg-red-50/50' : 'border-slate-100 focus:ring-4 focus:ring-blue-500/5'}`}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Node</label>
                        <div className="relative group">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="node@mars.xyz"
                                className={`w-full bg-slate-50 border rounded-2xl pl-14 pr-6 py-4 text-sm font-medium outline-none transition-all ${errors.email ? 'border-red-500 bg-red-50/50' : 'border-slate-100 focus:ring-4 focus:ring-blue-500/5'}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Logistics Intel */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Terminal Address</label>
                        <textarea
                            name="address1"
                            value={formData.address1}
                            onChange={handleChange}
                            rows="2"
                            placeholder="Detailed coordinates (Street, Building, Area)..."
                            className={`w-full bg-slate-50 border rounded-2xl px-6 py-4 text-sm font-medium outline-none transition-all resize-none ${errors.address1 ? 'border-red-500 bg-red-50/50' : 'border-slate-100 focus:ring-4 focus:ring-blue-500/5'}`}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Pincode</label>
                            <input
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                placeholder="400001"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">State Sector</label>
                            <select
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                            >
                                <option value="">Select State</option>
                                {states.map((s) => (
                                    <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">City Hub</label>
                            <input
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="Mumbai"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StepConsigneeDetails;