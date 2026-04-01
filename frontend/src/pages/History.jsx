import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ImageCard from '../components/ImageCard';
import { Loader2, Calendar, Sparkles, Compass, Search, LayoutGrid, List, ArrowUp, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INSPIRATION_GALLERY = [
    { _id: 'insp-1', prompt: "A majestic glowing blue crystal dragon flying over a bioluminescent alien forest at midnight, highly detailed fantasy concept art", imageUrl: "https://images.unsplash.com/photo-1618331835717-8149e1e24bc1?w=800&q=80", createdAt: new Date(Date.now() - 86400000).toISOString() },
    { _id: 'insp-2', prompt: "A hyper-realistic cyberpunk city at night with neon lights reflecting in puddles, flying cars zooming by, cinematic lighting, 8k resolution", imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80", createdAt: new Date(Date.now() - 172800000).toISOString() },
    { _id: 'insp-3', prompt: "Close-up cinematic portrait of a cute golden retriever dog wearing futuristic astronaut gear on Mars, dramatic sunset lighting", imageUrl: "https://images.unsplash.com/photo-1533038590840-1cbea6d6d376?w=800&q=80", createdAt: new Date(Date.now() - 259200000).toISOString() },
    { _id: 'insp-4', prompt: "An isometric view of a tiny magical greenhouse floating in space, highly detailed 3d render, octane render", imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80", createdAt: new Date(Date.now() - 345600000).toISOString() },
    { _id: 'insp-5', prompt: "A steampunk owl with intricate brass gears and glowing amber eyes, perched on an old clock tower, moody atmospheric lighting", imageUrl: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80", createdAt: new Date(Date.now() - 432000000).toISOString() },
    { _id: 'insp-6', prompt: "Vibrant digital illustration of a retro 80s synthwave landscape with glowing wireframe mountains and a massive neon sun", imageUrl: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=800&q=80", createdAt: new Date(Date.now() - 518400000).toISOString() }
];

const History = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingRandom, setAddingRandom] = useState(false);
    
    // Advanced Features
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [showScrollTop, setShowScrollTop] = useState(false);

    const fetchHistory = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/images/history', config);
            
            // Combine Database images with permanent Inspiration Gallery!
            setImages([...data, ...INSPIRATION_GALLERY]);
        } catch (error) {
            toast.error('Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
        
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddRandomImages = async () => {
        setAddingRandom(true);
        toast.success("Synthesizing amazing random images...", { icon: '🪄' });
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            await axios.post('http://localhost:5000/api/images/store-random', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchHistory();
            toast.success("Random Inspiration Gallery Packed!");
        } catch (err) {
            toast.error("Failed to store random images");
        } finally {
            setAddingRandom(false);
        }
    };

    // Filter Logic
    const filteredImages = images.filter(img => 
        img.prompt.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Stats
    const userImagesCount = images.filter(img => !img._id.toString().startsWith('insp-')).length;

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 border-b border-gray-800 pb-6">
                <div className="flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-purple-500" />
                    <div>
                        <h1 className="text-3xl font-bold text-white">Your Workspace Data</h1>
                        <p className="text-gray-400 mt-1">Manage, search, and access all your past AI masterpieces.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleAddRandomImages}
                        disabled={addingRandom}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/40 hover:to-purple-600/40 border border-purple-500/30 transition-all text-purple-300 font-bold shadow-[0_0_15px_rgba(168,85,247,0.15)] disabled:opacity-50"
                    >
                        {addingRandom ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Store Random Items
                    </button>
                </div>
            </div>

            {/* Statistics Banner */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="glass p-4 rounded-2xl flex items-center gap-4 border border-gray-800">
                    <div className="bg-purple-500/20 p-3 rounded-xl"><Activity className="w-6 h-6 text-purple-400" /></div>
                    <div><p className="text-2xl font-bold text-white">{userImagesCount}</p><p className="text-xs text-gray-400 uppercase tracking-wide">Personal Images</p></div>
                </div>
                <div className="glass p-4 rounded-2xl flex items-center gap-4 border border-gray-800">
                    <div className="bg-blue-500/20 p-3 rounded-xl"><Compass className="w-6 h-6 text-blue-400" /></div>
                    <div><p className="text-2xl font-bold text-white">{INSPIRATION_GALLERY.length}</p><p className="text-xs text-gray-400 uppercase tracking-wide">Inspiration Ideas</p></div>
                </div>
            </div>

            {/* Smart Toolbox */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 glass p-2 rounded-2xl border border-gray-800">
                <div className="relative w-full sm:w-96 group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-purple-400 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search history by prompt keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-900/50 border border-transparent focus:border-purple-500/50 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none transition-all placeholder-gray-600"
                    />
                </div>
                
                <div className="flex bg-gray-900/80 rounded-xl p-1 border border-gray-700/50 w-full sm:w-auto">
                    <button onClick={() => setViewMode('grid')} className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${viewMode === 'grid' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                        <LayoutGrid className="w-4 h-4" /> Grid
                    </button>
                    <button onClick={() => setViewMode('list')} className={`flex-1 sm:flex-none flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${viewMode === 'list' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                        <List className="w-4 h-4" /> List
                    </button>
                </div>
            </div>

            {filteredImages.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center">
                    <Search className="w-16 h-16 text-gray-700 mb-4" />
                    <h2 className="text-xl font-bold text-gray-400">No images found matching "{searchQuery}"</h2>
                </div>
            ) : (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "flex flex-col gap-6"}>
                    {filteredImages.map((img, index) => (
                        <motion.div
                            key={img._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index > 10 ? 0 : index * 0.05 }}
                            className={viewMode === 'list' ? "w-full mx-auto max-w-3xl" : "h-full"}
                        >
                            <ImageCard 
                                image={img} 
                                onDelete={(deletedId) => setImages(prev => prev.filter(i => i._id !== deletedId))}
                            />
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Scroll to Top Component */}
            <AnimatePresence>
                {showScrollTop && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 p-4 bg-purple-600 text-white rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:bg-purple-500 transition-colors z-50"
                    >
                        <ArrowUp className="w-6 h-6" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default History;
