import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageSquare, Clock, CheckCircle, Send, User, ChevronRight, ArrowLeft, Image as ImageIcon, Paperclip, Phone, Play, FileText, Download } from 'lucide-react';
// import { io } from 'socket.io-client';

// const socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');

const RequestQuote = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuote, setSelectedQuote] = useState(null);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [reply, setReply] = useState('');
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNewForm, setShowNewForm] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (selectedQuote) scrollToBottom();
    }, [selectedQuote?.messages]);

    const fetchMyQuotes = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/quotes/my-quotes`, config);
            setQuotes(data);
            if (selectedQuote) {
                const updated = data.find(q => q._id === selectedQuote._id);
                if (updated) setSelectedQuote(updated);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching quotes:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyQuotes();

        /* 
        // Polling removed (replaced by socket)
        socket.on('new_quote_message', ({ quoteId, message }) => {
            setQuotes(prev => prev.map(q => {
                if (q._id === quoteId) {
                    return { ...q, messages: [...q.messages, message], updatedAt: new Date() };
                }
                return q;
            }));

            setSelectedQuote(prev => {
                if (prev && prev._id === quoteId) {
                    return { ...prev, messages: [...prev.messages, message] };
                }
                return prev;
            });
        });

        socket.on('new_quote_request', (newQuote) => {
            setQuotes(prev => [newQuote, ...prev]);
        });

        return () => {
            socket.off('new_quote_message');
            socket.off('new_quote_request');
        };
        */
    }, [selectedQuote?._id]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!subject.trim() && !file) return;
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('subject', subject);
            formData.append('message', message);
            if (file) formData.append('file', file);

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/quotes`, formData, config);
            setSubject('');
            setMessage('');
            setFile(null);
            setShowNewForm(false);
            fetchMyQuotes();
        } catch (error) {
            console.error('Error creating quote:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReply = async () => {
        if (!reply.trim() && !file) return;
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('text', reply);
            if (file) formData.append('file', file);

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/quotes/${selectedQuote._id}/message`, formData, config);
            setReply('');
            setFile(null);
            // fetchMyQuotes() not strictly needed with socket, but good for sync
        } catch (error) {
            console.error('Error sending reply:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/quotes/${id}/read`, {}, config);
        } catch (err) { }
    };

    const selectQuote = (quote) => {
        setSelectedQuote(quote);
        if (!quote.userHasRead) markAsRead(quote._id);
    };

    if (loading) return <div className="p-8 text-center text-blue-600 font-bold">Loading your requests...</div>;

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto h-[calc(100vh-120px)] overflow-hidden flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Support & Quotations</h2>
                        <p className="text-sm text-gray-500">Track and discuss your shipment queries with our team.</p>
                    </div>
                </div>
                {!showNewForm && !selectedQuote && (
                    <button
                        onClick={() => setShowNewForm(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95"
                    >
                        New Request
                    </button>
                )}
            </div>

            <div className="flex flex-1 gap-8 overflow-hidden">
                {/* Conversations List */}
                <div className={`flex-1 flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-hide ${(selectedQuote || showNewForm) ? 'hidden lg:flex' : 'flex'}`}>
                    {quotes.map((quote) => (
                        <div
                            key={quote._id}
                            onClick={() => selectQuote(quote)}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md relative ${selectedQuote?._id === quote._id
                                ? 'border-blue-400 bg-blue-50/30'
                                : 'border-gray-100 bg-white'
                                }`}
                        >
                            {!quote.userHasRead && (
                                <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                            )}
                            <div className="flex justify-between items-start mb-3">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${quote.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                                    }`}>
                                    {quote.status}
                                </span>
                                <span className="text-[10px] text-gray-400">{new Date(quote.updatedAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">{quote.subject}</h3>
                            <p className="text-gray-500 text-sm line-clamp-1 italic">
                                "{quote.messages[quote.messages.length - 1]?.text}"
                            </p>
                        </div>
                    ))}

                    {quotes.length === 0 && !showNewForm && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium">No previous requests found.</p>
                            <button onClick={() => setShowNewForm(true)} className="mt-4 text-blue-600 font-bold hover:underline">Start a new request</button>
                        </div>
                    )}
                </div>

                {/* Chat / Form Panel */}
                <div className={`w-full lg:w-[500px] bg-white rounded-3xl border border-gray-100 shadow-xl flex flex-col overflow-hidden ${(selectedQuote || showNewForm) ? 'flex' : 'hidden lg:flex'}`}>
                    {showNewForm ? (
                        <div className="p-8 flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-8">
                                <button onClick={() => setShowNewForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <h3 className="text-xl font-bold">New Request</h3>
                            </div>
                            <form onSubmit={handleCreate} className="space-y-6 flex-1">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Subject</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="What is this regarding?"
                                        className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-400 focus:outline-none transition-all"
                                    />
                                </div>
                                <div className="flex-1 min-h-0 flex flex-col">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Message</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Describe your query in detail..."
                                        className="w-full flex-1 p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-400 focus:outline-none transition-all resize-none"
                                    ></textarea>
                                </div>

                                {file && (
                                    <div className="p-3 bg-blue-50 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <Paperclip className="w-4 h-4 text-blue-600 shrink-0" />
                                            <span className="text-xs text-blue-700 truncate font-medium">{file.name}</span>
                                        </div>
                                        <button onClick={() => setFile(null)} className="text-blue-400 hover:text-red-500">×</button>
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current.click()}
                                        className="p-4 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-all"
                                    >
                                        <Paperclip className="w-6 h-6" />
                                    </button>
                                    <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || (!subject.trim() && !file)}
                                        className={`flex-1 py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95 ${isSubmitting || (!subject.trim() && !file)
                                            ? 'bg-gray-100 text-gray-400'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                                            }`}
                                    >
                                        {isSubmitting ? 'Submitting...' : 'Send Request'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : selectedQuote ? (
                        <div className="flex flex-col h-full">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setSelectedQuote(null)} className="lg:hidden p-2 hover:bg-gray-100 rounded-full">
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{selectedQuote.subject}</h3>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Conversation started on {new Date(selectedQuote.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide bg-gray-50/10">
                                {selectedQuote.messages.map((msg, i) => {
                                    const showDate = i === 0 || new Date(msg.createdAt).toDateString() !== new Date(selectedQuote.messages[i - 1].createdAt).toDateString();
                                    const isUser = msg.sender === 'user';
                                    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

                                    return (
                                        <React.Fragment key={i}>
                                            {showDate && (
                                                <div className="flex justify-center my-4">
                                                    <span className="bg-gray-200/50 text-gray-500 text-[10px] px-3 py-1 rounded-full font-bold">
                                                        {new Date(msg.createdAt).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}
                                                    </span>
                                                </div>
                                            )}
                                            <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${isUser
                                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                                    : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-sm'
                                                    }`}>

                                                    {msg.fileUrl && (
                                                        <div className="mb-2">
                                                            {msg.fileType === 'image' && (
                                                                <img src={`${API_URL}${msg.fileUrl}`} alt="Sent" className="max-w-full rounded-xl shadow-sm cursor-pointer" onClick={() => window.open(`${API_URL}${msg.fileUrl}`, '_blank')} />
                                                            )}
                                                            {msg.fileType === 'audio' && (
                                                                <audio controls src={`${API_URL}${msg.fileUrl}`} className="max-w-full" />
                                                            )}
                                                            {msg.fileType === 'video' && (
                                                                <video controls src={`${API_URL}${msg.fileUrl}`} className="max-w-full rounded-xl" />
                                                            )}
                                                            {msg.fileType === 'document' && (
                                                                <a href={`${API_URL}${msg.fileUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-blue-600 no-underline">
                                                                    <Download className="w-4 h-4" />
                                                                    <span className="text-xs font-bold truncate">{msg.fileName || 'Download Document'}</span>
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}

                                                    {msg.text && <p className="leading-relaxed">{msg.text}</p>}

                                                    <div className={`text-[10px] mt-1 ${isUser ? 'text-white/60' : 'text-gray-400'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-6 bg-white border-t border-gray-100">
                                {file && (
                                    <div className="mb-4 p-2 bg-blue-50 rounded-xl flex items-center justify-between border border-blue-100 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                                <Paperclip className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold text-blue-700 truncate max-w-[200px]">{file.name}</span>
                                        </div>
                                        <button onClick={() => setFile(null)} className="p-1 hover:bg-white rounded-full text-blue-400 hover:text-red-500 transition-colors">×</button>
                                    </div>
                                )}
                                <div className="flex gap-2 items-center">
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                    >
                                        <Paperclip className="w-6 h-6" />
                                    </button>
                                    <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                                    <textarea
                                        value={reply}
                                        onChange={(e) => setReply(e.target.value)}
                                        placeholder="Type your reply..."
                                        rows="1"
                                        className="flex-1 p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-400 focus:outline-none transition-all text-sm resize-none scrollbar-hide"
                                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
                                    ></textarea>
                                    <button
                                        onClick={handleReply}
                                        disabled={isSubmitting || (!reply.trim() && !file)}
                                        className={`p-4 rounded-2xl font-bold flex items-center justify-center transition-all transform active:scale-95 ${isSubmitting || (!reply.trim() && !file)
                                            ? 'bg-gray-100 text-gray-300'
                                            : 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                            }`}
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-300">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare className="w-10 h-10 text-gray-200" />
                            </div>
                            <h3 className="font-bold">Message History</h3>
                            <p className="text-sm">Select a previous query to view the discussion or start a new one.</p>
                        </div>
                    )}
                </div>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setFile(e.target.files[0])} />
        </div>
    );
};

export default RequestQuote;
