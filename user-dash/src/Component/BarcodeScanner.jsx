import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Scan, Box, MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const BarcodeScanner = () => {
    const [scanResult, setScanResult] = useState('');
    const [manualCode, setManualCode] = useState('');
    const [status, setStatus] = useState('Picked Up');
    const [location, setLocation] = useState('Hub');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const scannerRef = useRef(null);

    useEffect(() => {
        // Initialize Scanner
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        scanner.render(onScanSuccess, onScanFailure);
        scannerRef.current = scanner;

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear html5-qrcode scanner. ", error);
                });
            }
        };
    }, []);

    const onScanSuccess = (decodedText, decodedResult) => {
        setScanResult(decodedText);
        handleUpdate(decodedText);

        // Optional: Pause scanner or clear
        // scannerRef.current.pause(); 
    };

    const onScanFailure = (error) => {
        // handle scan failure, usually better to ignore and keep scanning.
        // console.warn(`Code scan error = ${error}`);
    };

    const handleUpdate = async (code) => {
        const awb = code || manualCode;
        if (!awb) {
            setMessage({ type: 'error', text: 'Please enter or scan an AWB code' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/track/scan`,
                {
                    awb,
                    status,
                    location
                },
                config
            );

            setMessage({ type: 'success', text: `Success! ${awb} updated to ${status}` });
            setScanResult(awb);
            setManualCode(''); // Clear manual input

            // Resume scanning if paused
            // scannerRef.current.resume();

        } catch (error) {
            console.error('Scan update error:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update status'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800 dark:text-gray-100">
                <Scan className="w-6 h-6 mr-2 text-blue-600" />
                AWB Scanner
            </h2>

            {/* Scanner Viewport */}
            <div id="reader" className="w-full mb-6 rounded-lg overflow-hidden border-2 border-dashed border-gray-300"></div>

            {/* Scan Result Display */}
            {scanResult && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase">Last Scanned</p>
                        <p className="text-lg font-mono font-bold text-gray-800 dark:text-white">{scanResult}</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
            )}

            {/* Status & Location Selection */}
            <div className="space-y-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status Update</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="Picked Up">Picked Up</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Arrived at Hub">Arrived at Hub</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full pl-9 p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="e.g. Mumbai Hub"
                        />
                    </div>
                </div>
            </div>

            {/* Manual Input Fallback */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Enter AWB Manually"
                    className="flex-1 p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono"
                />
                <button
                    onClick={() => handleUpdate(null)}
                    disabled={loading || !manualCode}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update'}
                </button>
            </div>

            {/* Messages */}
            {message && (
                <div className={`p-3 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="text-sm font-medium">{message.text}</span>
                </div>
            )}
        </div>
    );
};

export default BarcodeScanner;
