import React, { useState } from 'react';
import { Package, Trash2, Edit, Plus, Info, ChevronRight, Layers, Box, Maximize, Weight, IndianRupee, Tag, ShieldAlert, Upload, Loader2 } from 'lucide-react';

const StepShipmentDetails = ({
    formData, currentItem, handleItemChange, addItem, removeItem, editItem, handleImageChange, removeImage, defaultItemValue, canEdit = true
}) => {
    const [packingPref, setPackingPref] = useState('single'); // 'single' or 'multiple'

    const totalWeight = formData.items.reduce((sum, item) => sum + parseFloat(item.weight || 0), 0);
    const totalValue = formData.items.reduce((sum, item) => sum + parseFloat(item.value || 0), 0);

    return (
        <div className={`space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 ${!canEdit ? 'pointer-events-none opacity-80' : ''}`}>
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-semibold text-sm">
                    02
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Shipment Details</h3>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Inventory & Composition Protocol</p>
                </div>
            </div>

            {/* Cataloged Items List */}
            {formData.items.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.items.map((item, index) => (
                        <div key={index} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">{item.name}</h4>
                                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-0.5">Qty: {item.quantity} • {item.weight}kg</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => editItem(index)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Edit className="w-3.5 h-3.5" /></button>
                                    <button onClick={() => removeItem(index)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[9px] font-semibold uppercase rounded-lg border border-slate-100">VAL: ₹{item.value}</span>
                                {item.hsCode && <span className="px-2.5 py-1 bg-amber-50 text-amber-600 text-[9px] font-semibold uppercase rounded-lg border border-amber-100">HS: {item.hsCode}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Packing Preference */}
            <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span className="text-[11px] font-semibold text-slate-900 uppercase tracking-widest">Packing Configuration</span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <button onClick={() => setPackingPref('single')} className={`p-6 rounded-2xl border transition-all text-left flex items-center gap-4 border-slate-100 ${packingPref === 'single' ? 'bg-blue-50 border-blue-600/20' : 'bg-white hover:bg-slate-50'}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${packingPref === 'single' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-300'}`}>
                            <Box className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">Single Box</p>
                            <p className="text-[9px] text-slate-400 font-medium uppercase mt-0.5">Combine all units into one payload</p>
                        </div>
                    </button>
                    <button onClick={() => setPackingPref('multiple')} className={`p-6 rounded-2xl border transition-all text-left flex items-center gap-4 border-slate-100 ${packingPref === 'multiple' ? 'bg-blue-50 border-blue-600/20' : 'bg-white hover:bg-slate-50'}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${packingPref === 'multiple' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-300'}`}>
                            <Layers className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">Multi-Unit</p>
                            <p className="text-[9px] text-slate-400 font-medium uppercase mt-0.5">Treat units as separate nodes</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Input Interface */}
            <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm space-y-8">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Asset Name *</label>
                        <div className="relative group">
                            <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                            <input name="name" value={currentItem.name} onChange={handleItemChange} placeholder="e.g. ELECTRONIC COMPONENT" className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-3.5 text-xs font-semibold uppercase outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Quantity *</label>
                        <input type="number" name="quantity" value={currentItem.quantity} onChange={handleItemChange} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3.5 text-xs font-semibold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Asset Description</label>
                    <textarea name="productType" value={currentItem.productType} onChange={handleItemChange} placeholder="Detailed manifest for customs..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-medium resize-none h-24 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all uppercase" />
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Length (cm)</label>
                        <input type="number" name="length" value={currentItem.length} onChange={handleItemChange} placeholder="00" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3.5 text-xs font-semibold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Width (cm)</label>
                        <input type="number" name="breadth" value={currentItem.breadth} onChange={handleItemChange} placeholder="00" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3.5 text-xs font-semibold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Height (cm)</label>
                        <input type="number" name="height" value={currentItem.height} onChange={handleItemChange} placeholder="00" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3.5 text-xs font-semibold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Weight (kg) *</label>
                        <div className="relative group">
                            <Weight className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                            <input type="number" name="weight" value={currentItem.weight} onChange={handleItemChange} placeholder="0.5" className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-3.5 text-xs font-semibold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Value (INR) *</label>
                        <div className="relative group">
                            <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                            <input type="number" name="value" value={currentItem.value} onChange={handleItemChange} placeholder="500" className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-6 py-3.5 text-xs font-semibold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
                        </div>
                    </div>
                </div>

                {/* Imagery section */}
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Asset Imagery (2-4 photos)</p>
                    <div className="grid grid-cols-4 gap-4">
                        {currentItem.imagePreviews.map((preview, idx) => (
                            <div key={idx} className="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 group">
                                <img src={preview} className="w-full h-full object-cover" alt="" />
                                <button onClick={() => removeImage(idx)} className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        {currentItem.imagePreviews.length < 4 && (
                            <div className="aspect-square bg-slate-50 border border-dashed border-slate-200 rounded-2xl group hover:border-blue-600 hover:bg-blue-50/50 transition-all cursor-pointer relative overflow-hidden">
                                <input type="file" multiple onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <Upload className="w-6 h-6 text-slate-300 group-hover:text-blue-600 transition-all" />
                                    <p className="text-[8px] font-bold text-slate-400 uppercase mt-2 group-hover:text-blue-600">Add Frames</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-4">
                    {currentItem.isEditing && (
                        <button onClick={() => {
                            // Reset current item back to empty if we cancel edit
                            handleItemChange({ target: { name: 'isEditing', value: false } }); // Just to trigger a re-render if needed, though strictly it's controlled by parent usually.
                            addItem({ cancelEdit: true }); // Pass a flag to addItem if you want to handle cancel specifically in parent, or just clear the form. 
                        }} className="px-10 py-4 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all font-sans active:scale-95">
                            Cancel
                        </button>
                    )}
                    <button onClick={addItem} className="px-10 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg flex items-center gap-3 active:scale-95">
                        {currentItem.isEditing ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {currentItem.isEditing ? 'Update Item' : 'Add Item'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StepShipmentDetails;
