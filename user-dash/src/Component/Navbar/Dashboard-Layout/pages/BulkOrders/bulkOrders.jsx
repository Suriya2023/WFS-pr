
import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Download, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';

function BulkOrders({ setActiveRoute }) {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const [uploadStatus, setUploadStatus] = useState(null); // { type: 'success' | 'error', message: '' }
    const [uploading, setUploading] = useState(false);
    const [importResults, setImportResults] = useState(null); // { success: 0, failed: 0, errors: [] }

    const uploadFile = async (file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploadStatus(null);
        setUploading(true);

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            };

            const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/orders/import`, formData, config);

            setUploadStatus({
                type: 'success',
                message: data.message || 'File uploaded successfully!'
            });
            if (data.results) {
                setImportResults(data.results);
            }
            console.log('Upload success:', data);
        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus({
                type: 'error',
                message: error.response?.data?.message || 'Failed to upload file. Please check format.'
            });
            if (error.response?.data?.results) {
                setImportResults(error.response.data.results);
            }
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            uploadFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            uploadFile(e.target.files[0]);
        }
    };

    return (
        <div className="min-h-full bg-gray-50/50 dark:bg-gray-950 px-4 lg:px-6 py-6 font-sans">
            {/* Content */}
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upload Section */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Upload Bulk Orders</h2>

                        {/* Upload Box */}
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${dragActive
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 bg-gray-50'
                                }`}
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <Upload className="w-8 h-8 text-blue-600" />
                                </div>
                                <p className="text-lg font-medium text-blue-600 mb-2">
                                    Drag and Drop file here
                                </p>
                                <p className="text-gray-500 mb-4">-OR-</p>
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        accept=".csv,.xlsx,.xls"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <span className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium inline-block">
                                        Browse File
                                    </span>
                                </label>
                            </div>
                        </div>

                        <p className="text-sm text-gray-500 mt-4">
                            Upload Excel or CSV file size less than 100mb
                        </p>

                        {uploadStatus && (
                            <div className={`mt-4 p-4 rounded-lg flex flex-col gap-2 ${uploadStatus.type === 'success'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                <div className="flex items-center gap-2">
                                    {uploadStatus.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    <p className="font-medium">{uploadStatus.message}</p>
                                </div>
                                {importResults && (
                                    <div className="mt-2 text-sm bg-white/50 p-2 rounded">
                                        <div className="flex gap-4 font-semibold mb-2">
                                            <p className="text-green-700">Success: {importResults.success}</p>
                                            <p className="text-red-700">Failed: {importResults.failed}</p>
                                        </div>
                                        {importResults.errors && importResults.errors.length > 0 && (
                                            <div className="mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded text-left bg-white">
                                                <div className="p-2 bg-gray-50 border-b border-gray-100 font-semibold text-xs text-gray-500 uppercase">
                                                    Error Log
                                                </div>
                                                <ul className="divide-y divide-gray-100">
                                                    {importResults.errors.map((err, idx) => (
                                                        <li key={idx} className="p-2 text-red-600 font-mono text-xs hover:bg-red-50">
                                                            {err}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {uploading && <p className="mt-2 text-blue-600 font-medium">Uploading...</p>}
                    </div>

                    {/* Instructions Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Instructions</h3>

                            <ul className="space-y-3 text-sm text-gray-700">
                                <li className="flex gap-2">
                                    <span className="text-gray-900 font-medium">•</span>
                                    <span>Please upload your CSV file containing file containing the orders.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-gray-900 font-medium">•</span>
                                    <span>The screen will only show orders which have, and the rest of records will be imported.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-gray-900 font-medium">•</span>
                                    <span>You can download a sample CSV file and the country/state code list below for reference.</span>
                                </li>
                            </ul>

                            <div className="mt-6 space-y-3">
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                                    <Download className="w-5 h-5" />
                                    Sample CSV File
                                </button>
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                                    <Download className="w-5 h-5" />
                                    Country & State List
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BulkOrders;