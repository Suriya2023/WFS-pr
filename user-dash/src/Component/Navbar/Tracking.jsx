import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { io } from 'socket.io-client';
import { Search, Package, MapPin, Clock, CheckCircle, Circle, XCircle, Truck } from 'lucide-react';

// Initialize socket outside component to avoid multiple connections
// const socket = io(import.meta.env.VITE_API_BASE_URL);


function Tracking() {
  const [trackingId, setTrackingId] = useState('');
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /*
  useEffect(() => {
    // Listen for real-time updates
    socket.on('tracking_update', (updatedOrder) => {
      if (tracking && (updatedOrder._id === tracking._id || updatedOrder.trackingId === tracking.trackingId)) {
        // Adapt the data structure if necessary to match the 'tracking' state format
        // Assuming the event sends the full order object which matches the API response structure
        // Or we might need to re-fetch to get the purely formatted view model if the backend event sends raw DB model

        // For now, let's assume valid data or re-fetch for safety
        handleTrack(new Event('submit'), updatedOrder.trackingId || trackingId);
      }
    });

    return () => {
      socket.off('tracking_update');
    };
  }, [tracking, trackingId]);
  */

  useEffect(() => {
    let interval;
    if (tracking && !loading) {
      interval = setInterval(() => {
        handleTrack(null, tracking.trackingId);
      }, 30000); // Auto-sync every 30 seconds
    }
    return () => clearInterval(interval);
  }, [tracking, loading]);

  const handleTrack = async (e, idOverride = null) => {
    if (e) e.preventDefault();
    const idToTrack = (idOverride || trackingId || '').trim();

    if (!idToTrack) {
      if (!idOverride) setError('Please enter a tracking ID');
      return;
    }

    if (!idOverride) setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/track/index.php?id=${idToTrack}`);
      setTracking(data);
    } catch (err) {
      console.error('Tracking error:', err);
      if (!idOverride) {
        setTracking(null);
        setError(err.response?.data?.message || 'Tracking ID not found');
      }
    } finally {
      if (!idOverride) setLoading(false);
    }
  };

  const getStatusIcon = (status, completed) => {
    if (completed) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    }
    return <Circle className="w-6 h-6 text-gray-300" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      ready: 'bg-blue-100 text-blue-800',
      packed: 'bg-purple-100 text-purple-800',
      manifested: 'bg-yellow-100 text-yellow-800',
      picked_up: 'bg-indigo-100 text-indigo-800',
      dispatched: 'bg-orange-100 text-orange-800',
      received: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status?.toLowerCase()] || colors.draft;
  };

  return (
    <div className="min-h-screen bg-yellow-50/20 py-20 px-4 flex justify-center">
      <div className="max-w-7xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black text-red-700 mb-4 tracking-tighter uppercase">Track Your <span className="text-gray-900">Shipment</span></h1>
          <p className="text-xl font-bold text-gray-600 uppercase tracking-widest">Real-time updates for your package delivery</p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 mb-12 border border-yellow-100">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-7 h-7 text-red-600" />
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                placeholder="Enter AWB / Tracking Number"
                className="w-full pl-16 pr-6 py-6 text-xl bg-yellow-50/50 border-2 border-yellow-100 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-red-600 outline-none transition-all font-black text-gray-900 placeholder:text-gray-300 uppercase tracking-widest"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white font-black text-xl px-12 py-6 rounded-2xl transition-all shadow-xl shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] uppercase tracking-widest transform active:scale-95"
            >
              {loading ? 'Searching...' : 'Track Now'}
            </button>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-center gap-4 text-red-700 mb-8 animate-fade-in">
            <XCircle className="w-6 h-6 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {tracking && (
          <div className="space-y-6 animate-fade-in">
            {/* Status Header */}
            <div className="bg-white rounded-[2rem] shadow-xl p-8 border-l-8 border-red-700 border-t border-r border-b border-yellow-100">
              <div className="flex flex-wrap justify-between items-center gap-6">
                <div>
                  <h2 className="text-3xl font-black text-red-700 tracking-tighter uppercase">Tracking Info</h2>
                  <p className="text-gray-500 mt-2 font-bold uppercase tracking-wider text-xs">Tracking ID / AWB: <span className="font-black text-gray-900 text-lg ml-2">{tracking.trackingId}</span></p>
                  <p className="text-gray-500 font-bold uppercase tracking-wider text-xs">Courier: <span className="font-black text-red-600 ml-2">BGL PREMIUM</span></p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-6 py-3 rounded-xl font-black uppercase text-sm tracking-widest shadow-lg ${getStatusColor(tracking.status)}`}>
                    {tracking.status}
                  </span>
                  <button
                    onClick={() => handleTrack(new Event('submit'))}
                    className="text-red-700 text-sm font-black hover:underline mt-4 flex items-center gap-2 uppercase tracking-tighter"
                  >
                    <Truck className="w-5 h-5" /> Refresh Status
                  </button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Timeline */}
              {/* Timeline */}
              <div className="bg-white rounded-[2rem] shadow-xl p-10 border border-yellow-100">
                <h3 className="text-2xl font-black text-red-700 mb-10 flex items-center gap-3 uppercase tracking-tighter">
                  <Clock className="w-7 h-7" />
                  Shipment History
                </h3>
                <div className="space-y-10 pl-2">
                  {/* Order Received */}
                  <div className="relative pl-10 border-l-4 border-yellow-50 last:border-0 pb-2">
                    <div className="absolute -left-[14px] top-0 bg-white">
                      <CheckCircle className="w-7 h-7 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-black text-xl text-gray-900 tracking-tight uppercase">Order received</h4>
                      <p className="text-sm text-gray-500 mt-1 font-bold">Details checking</p>
                    </div>
                  </div>

                  {/* Processing – Verification */}
                  <div className="relative pl-10 border-l-4 border-yellow-50 last:border-0 pb-2">
                    <div className="absolute -left-[14px] top-0 bg-white">
                      {['ready', 'packed', 'manifested', 'picked_up', 'dispatched', 'received'].includes(tracking.status?.toLowerCase()) ? (
                        <CheckCircle className="w-7 h-7 text-green-500" />
                      ) : (
                        <Circle className="w-7 h-7 text-gray-200" />
                      )}
                    </div>
                    <div>
                      <h4 className={`font-black text-xl tracking-tight uppercase ${['ready', 'packed', 'manifested', 'picked_up', 'dispatched', 'received'].includes(tracking.status?.toLowerCase()) ? 'text-gray-900' : 'text-gray-300'}`}>
                        Verification
                      </h4>
                      <p className="text-sm text-gray-500 mt-1 font-bold">
                        {['ready', 'packed', 'manifested', 'picked_up', 'dispatched', 'received'].includes(tracking.status?.toLowerCase())
                          ? 'Shipment verified. Preparing shipping label'
                          : 'Your shipment is being verified by our team'}
                      </p>
                    </div>
                  </div>

                  {/* Processing – Label Generating */}
                  <div className="relative pl-10 border-l-4 border-yellow-50 last:border-0 pb-2">
                    <div className="absolute -left-[14px] top-0 bg-white">
                      {tracking.status?.toLowerCase() === 'packed' ? (
                        <CheckCircle className="w-7 h-7 text-red-600 animate-pulse" />
                      ) : ['manifested', 'picked_up', 'dispatched', 'received'].includes(tracking.status?.toLowerCase()) ? (
                        <CheckCircle className="w-7 h-7 text-green-500" />
                      ) : (
                        <Circle className="w-7 h-7 text-gray-200" />
                      )}
                    </div>
                    <div>
                      <h4 className={`font-black text-xl tracking-tight uppercase ${tracking.status?.toLowerCase() === 'packed' ? 'text-red-600' : ['manifested', 'picked_up', 'dispatched', 'received'].includes(tracking.status?.toLowerCase()) ? 'text-gray-900' : 'text-gray-300'}`}>
                        Label Generating
                      </h4>
                      <p className="text-sm text-gray-500 mt-1 font-bold">
                        {tracking.status?.toLowerCase() === 'packed' ? 'Shipping label is being generated' : ['manifested', 'picked_up', 'dispatched', 'received'].includes(tracking.status?.toLowerCase()) ? 'Shipping label generated' : 'Pending label generation'}
                      </p>
                    </div>
                  </div>

                  {/* Pickup Scheduled */}
                  <div className="relative pl-10 border-l-4 border-yellow-50 last:border-0 pb-2">
                    <div className="absolute -left-[14px] top-0 bg-white">
                      {['picked_up', 'dispatched', 'received'].includes(tracking.status?.toLowerCase()) ? (
                        <CheckCircle className="w-7 h-7 text-green-500" />
                      ) : tracking.status?.toLowerCase() === 'manifested' ? (
                        <CheckCircle className="w-7 h-7 text-blue-500 animate-pulse" />
                      ) : (
                        <Circle className="w-7 h-7 text-gray-200" />
                      )}
                    </div>
                    <div>
                      <h4 className={`font-black text-xl tracking-tight uppercase ${['manifested', 'picked_up', 'dispatched', 'received'].includes(tracking.status?.toLowerCase()) ? 'text-gray-900' : 'text-gray-300'}`}>
                        Pickup Scheduled
                      </h4>
                      <p className="text-sm text-gray-500 mt-1 font-bold">
                        {['picked_up', 'dispatched', 'received'].includes(tracking.status?.toLowerCase())
                          ? 'Your parcel has been picked up'
                          : tracking.status?.toLowerCase() === 'manifested'
                            ? 'Pickup scheduled / Ready for collection'
                            : 'Pending pickup scheduling'}
                      </p>
                    </div>
                  </div>

                  {/* In Transit */}
                  <div className="relative pl-10 border-l-4 border-yellow-50 last:border-0 pb-2">
                    <div className="absolute -left-[14px] top-0 bg-white">
                      {['dispatched', 'received'].includes(tracking.status?.toLowerCase()) ? (
                        <CheckCircle className="w-7 h-7 text-green-500" />
                      ) : (
                        <Circle className="w-7 h-7 text-gray-200" />
                      )}
                    </div>
                    <div>
                      <h4 className={`font-black text-xl tracking-tight uppercase ${['dispatched', 'received'].includes(tracking.status?.toLowerCase()) ? 'text-gray-900' : 'text-gray-300'}`}>
                        In Transit
                      </h4>
                      <p className="text-sm text-gray-500 mt-1 font-bold">
                        {['dispatched', 'received'].includes(tracking.status?.toLowerCase()) ? 'Your shipment is in transit' : 'Awaiting transit start'}
                      </p>
                    </div>
                  </div>

                  {/* Delivered */}
                  <div className="relative pl-10 border-l-4 border-yellow-50 last:border-0">
                    <div className="absolute -left-[14px] top-0 bg-white">
                      {['received', 'delivered'].includes(tracking.status?.toLowerCase()) ? (
                        <CheckCircle className="w-7 h-7 text-green-500" />
                      ) : (
                        <Circle className="w-7 h-7 text-gray-200" />
                      )}
                    </div>
                    <div>
                      <h4 className={`font-black text-xl tracking-tight uppercase ${['received', 'delivered'].includes(tracking.status?.toLowerCase()) ? 'text-gray-900' : 'text-gray-300'}`}>
                        Delivered
                      </h4>
                      <p className="text-sm text-gray-500 mt-1 font-bold">
                        {['received', 'delivered'].includes(tracking.status?.toLowerCase()) ? 'Shipment delivered successfully' : 'Pending delivery'}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Details Column */}
              <div className="space-y-6">
                {/* Destination */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#1a4ca3]" />
                    Destination
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Receiver</p>
                      <p className="font-medium text-gray-900">{tracking.destination.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Address</p>
                      <p className="text-gray-700">{tracking.destination.address}</p>
                      <p className="text-gray-700">{tracking.destination.city}, {tracking.destination.state} - {tracking.destination.pincode}</p>
                    </div>
                  </div>
                </div>

                {/* Package Info */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#1a4ca3]" />
                    Package Info
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Weight</p>
                      <p className="font-medium text-gray-900">{tracking.package.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Value</p>
                      <p className="font-medium text-gray-900">₹{tracking.package.declaredValue}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Contents</p>
                      <p className="font-medium text-gray-900">
                        {tracking.package.items.map(i => i.name).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tracking;
