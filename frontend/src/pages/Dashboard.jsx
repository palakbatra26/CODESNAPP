import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Sparkles, Loader2, Image as ImageIcon, Wand2, Download, Settings, Palette, Cpu, ImageMinus, ChevronDown, ChevronUp, Timer, Maximize2, Zap, X, Hash, Scan, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const surprisePrompts = [
    "A hyper-realistic cyberpunk city at night with neon lights reflecting in puddles, flying cars zooming by, cinematic lighting, 8k resolution, Unreal Engine 5 render",
    "A majestic glowing blue crystal dragon flying over a bioluminescent alien forest at midnight, highly detailed fantasy concept art",
    "Close-up cinematic portrait of a cute golden retriever dog wearing futuristic astronaut gear on Mars, dramatic sunset lighting"
];

const SUGGESTIONS = [
    "Neon Samurai", "Floating Castle", "Retro Synthwave", "Macro Photography"
];

const STYLES = [
    { id: 'none', label: 'No Style', icon: '✨' },
    { id: 'Cinematic', label: 'Cinematic', icon: '🎬' },
    { id: 'Anime', label: 'Anime', icon: '🌸' },
    { id: 'Cyberpunk', label: 'Cyberpunk', icon: '🤖' },
    { id: '3D Render', label: '3D Render', icon: '🧊' },
    { id: 'Watercolor', label: 'Watercolor', icon: '🎨' },
    { id: 'Origami', label: 'Origami', icon: '📄' },
    { id: 'Neon Punk', label: 'Neon Punk', icon: '🚥' },
];

const MODELS = [
    { id: 'flux', label: 'Flux (Ultra HQ)', desc: 'Best details & high-end realism' },
    { id: 'turbo', label: 'Turbo (Fast)', desc: 'Extremely fast generations' }
];

const Dashboard = () => {
    // Basic Settings
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [lastRatio, setLastRatio] = useState('aspect-square');
    
    // Advanced Settings
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [style, setStyle] = useState('none');
    const [model, setModel] = useState('flux');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [customSeed, setCustomSeed] = useState('');
    const [upscale, setUpscale] = useState(false);

    // Active State
    const [loading, setLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [timer, setTimer] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        let interval;
        if (loading) {
            setTimer(0);
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        } else {
            setTimer(0);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const handleSurprise = () => {
        const randomPrompt = surprisePrompts[Math.floor(Math.random() * surprisePrompts.length)];
        setPrompt(randomPrompt);
    };

    const handleEnhance = () => {
        if (!prompt.trim()) {
            toast.error('Type a basic idea first to enhance it! (e.g. "A car")');
            return;
        }
        const enhancer = ", highly detailed, cinematic lighting, vivid colors, 8k resolution, hyper-realistic, masterpiece render art";
        if (!prompt.includes('8k resolution')) {
            setPrompt(p => p + enhancer);
            toast.success("Magic Prompt Applied! ✨");
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) {
            toast.error('Please enter a prompt');
            return;
        }

        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            if(!token) throw new Error("No token");
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            // Send full robust payload
            const payload = { prompt, aspectRatio, style, negativePrompt, model, customSeed, upscale };
            const { data } = await axios.post('http://localhost:5000/api/images/generate', payload, config);
            
            setGeneratedImage(data);
            setLastRatio(aspectRatio === '16:9' ? 'aspect-video' : aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-square');
            toast.success('Masterpiece generated successfully! 🎨');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate image');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!generatedImage) return;
        toast.success("Preparing secure High-Res Download...");
        const link = document.createElement('a');
        link.href = generatedImage.imageUrl;
        // Smart Title Generator based on prompt!
        const safePromptPart = generatedImage.prompt.substring(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.download = `ai-masterpiece-${safePromptPart || 'img'}-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
                    AI Studio Pro
                </h1>
                <p className="text-gray-400 text-lg md:text-xl font-light">The ultimate AI image generation workspace.</p>
            </div>

            <div className="glass rounded-3xl p-6 md:p-8 mb-12 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-gray-800">
                {/* Visual Ratio & Surprise Row */}
                <div className="flex flex-wrap items-center justify-between mb-8 gap-4 border-b border-gray-800/50 pb-6">
                    <div className="flex bg-gray-900/80 rounded-xl p-1.5 border border-gray-700/50 shadow-inner">
                        <button type="button" onClick={() => setAspectRatio('1:1')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${aspectRatio === '1:1' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-100' : 'text-gray-400 hover:text-white hover:bg-gray-800 scale-95'}`}>
                            Square (1:1)
                        </button>
                        <button type="button" onClick={() => setAspectRatio('16:9')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${aspectRatio === '16:9' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-100' : 'text-gray-400 hover:text-white hover:bg-gray-800 scale-95'}`}>
                            Landscape 🖥️
                        </button>
                        <button type="button" onClick={() => setAspectRatio('9:16')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${aspectRatio === '9:16' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-100' : 'text-gray-400 hover:text-white hover:bg-gray-800 scale-95'}`}>
                            Portrait 📱
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button type="button" onClick={handleEnhance} className="flex items-center gap-2 text-sm text-pink-400 font-bold hover:text-white transition-all px-4 py-3 rounded-xl bg-pink-500/10 hover:bg-pink-600/30 border border-pink-500/30 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                            <Zap className="w-4 h-4" />
                            Enhance Idea
                        </button>
                        <button type="button" onClick={handleSurprise} className="flex items-center gap-2 text-sm text-purple-400 font-bold hover:text-white transition-all px-4 py-3 rounded-xl bg-purple-500/10 hover:bg-purple-600/30 border border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                            <Wand2 className="w-5 h-5 animate-pulse" />
                            Surprise Me
                        </button>
                    </div>
                </div>

                {/* Main Prompt Bar */}
                <form onSubmit={handleGenerate} className="flex flex-col gap-3">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-grow relative group">
                            <Sparkles className="absolute left-5 top-1/2 transform -translate-y-1/2 text-purple-400/80 w-6 h-6 group-focus-within:text-purple-400 transition-colors" />
                            <input 
                                type="text" 
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                maxLength={500}
                                placeholder="Describe your masterpiece... (e.g., A glowing crystal dragon roaming a fantasy city)"
                                className="w-full bg-gray-900/60 border-2 border-gray-700/50 rounded-2xl pl-14 pr-16 py-5 text-white focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all text-lg shadow-inner placeholder-gray-500 font-medium"
                                disabled={loading}
                            />
                            {/* Clear Input Button */}
                            {prompt.length > 0 && (
                                <button type="button" onClick={() => setPrompt('')} className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 bg-gray-800 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading || !prompt.trim()}
                            className="md:w-48 w-full rounded-2xl bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-blue-600 via-purple-600 to-pink-600 text-white font-extrabold flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xl shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:scale-105"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Sparkles className="w-6 h-6" /> CREATE</>}
                        </button>
                    </div>
                    
                    {/* Character Counter & Auto Suggestions */}
                    <div className="flex justify-between items-center px-2">
                        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
                            <TrendingUp className="w-4 h-4 text-purple-500/70" />
                            {SUGGESTIONS.map(s => (
                                <button key={s} type="button" onClick={() => setPrompt(s)} className="text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full whitespace-nowrap transition-colors border border-purple-500/20 hover:border-purple-500/40">
                                    {s}
                                </button>
                            ))}
                        </div>
                        <div className={`text-xs font-mono font-medium ${prompt.length > 450 ? 'text-red-400' : 'text-gray-500'}`}>
                            {prompt.length} / 500
                        </div>
                    </div>

                    {/* Advanced Settings Toggle */}
                    <div className="mt-4 text-center md:text-left border-t border-gray-800/50 pt-4">
                        <button 
                            type="button" 
                            onClick={() => setShowAdvanced(!showAdvanced)} 
                            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white font-medium transition-colors bg-white/5 px-4 py-2 rounded-full"
                        >
                            <Settings className="w-4 h-4" />
                            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
                            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Advanced Settings Panel */}
                    <AnimatePresence>
                        {showAdvanced && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-8 mt-2 shadow-inner">
                                    
                                    {/* Style Engine Segment */}
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-gray-300 font-semibold text-sm uppercase tracking-wide">
                                            <Palette className="w-4 h-4 text-pink-400" /> Image Style Filter
                                        </label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {STYLES.map(s => (
                                                <button
                                                    key={s.id}
                                                    type="button"
                                                    onClick={() => setStyle(s.id)}
                                                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${style === s.id ? 'bg-pink-500/20 border-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'}`}
                                                >
                                                    <span className="text-2xl">{s.icon}</span>
                                                    <span className="text-xs font-medium">{s.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Model & Upscale Segments */}
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <label className="flex items-center gap-2 text-gray-300 font-semibold text-sm uppercase tracking-wide">
                                                    <Cpu className="w-4 h-4 text-blue-400" /> AI Architecture Model
                                                </label>
                                                <div className="grid grid-cols-1 gap-3">
                                                    {MODELS.map(m => (
                                                        <button
                                                            key={m.id}
                                                            type="button"
                                                            onClick={() => setModel(m.id)}
                                                            className={`p-4 rounded-xl border flex flex-col items-start gap-1 transition-all ${model === m.id ? 'bg-blue-500/20 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'}`}
                                                        >
                                                            <span className="text-sm font-bold">{m.label}</span>
                                                            <span className="text-xs opacity-70">{m.desc}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-3">
                                                    <label className="flex items-center gap-2 text-gray-300 font-semibold text-xs py-1 uppercase tracking-wide">
                                                        <Hash className="w-4 h-4 text-emerald-400" /> Custom Seed
                                                    </label>
                                                    <input 
                                                        type="number" 
                                                        placeholder="Random"
                                                        value={customSeed}
                                                        onChange={(e) => setCustomSeed(e.target.value)}
                                                        className="w-full bg-gray-900/60 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm shadow-inner placeholder-gray-600"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="flex items-center gap-2 text-gray-300 font-semibold text-xs py-1 uppercase tracking-wide">
                                                        <Scan className="w-4 h-4 text-amber-400" /> HD Upscale 1.5x
                                                    </label>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => setUpscale(!upscale)}
                                                        className={`w-full py-3 rounded-xl border font-bold text-sm transition-all ${upscale ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'bg-gray-900 border-gray-700 text-gray-500 hover:text-gray-400'}`}
                                                    >
                                                        {upscale ? 'ENABLED' : 'DISABLED'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Negative Prompt Segment */}
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-2 text-gray-300 font-semibold text-sm uppercase tracking-wide">
                                                <ImageMinus className="w-4 h-4 text-red-400" /> Negative Prompt
                                            </label>
                                            <textarea
                                                value={negativePrompt}
                                                onChange={(e) => setNegativePrompt(e.target.value)}
                                                placeholder="What should the AI avoid? (e.g., ugly, duplicate, poorly drawn, extra fingers...)"
                                                className="w-full h-full min-h-[160px] bg-gray-900/60 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-red-500 transition-all text-sm resize-none shadow-inner"
                                            />
                                        </div>
                                    </div>

                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </div>

            {/* Premium Interactive Loading UI */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-16 animate-in slide-in-from-bottom-8 duration-500">
                    <div className="relative">
                        <div className="absolute inset-0 bg-purple-500 rounded-full blur-[40px] opacity-40 animate-pulse"></div>
                        <Loader2 className="w-20 h-20 animate-spin text-purple-400 relative z-10" />
                    </div>
                    <p className="text-purple-300 mt-8 font-bold animate-pulse tracking-widest uppercase text-lg">Synthesizing Pixels</p>
                    <div className="mt-4 flex items-center gap-2 text-gray-400 font-mono text-sm">
                        <Timer className="w-4 h-4" />
                        Elapsed: {timer}s
                    </div>
                </div>
            )}

            {/* Generated Image Result */}
            {generatedImage && !loading && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="glass rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-700/50 p-4 relative group">
                        
                        <div className={`relative ${lastRatio} rounded-[1.5rem] overflow-hidden bg-black flex items-center justify-center shadow-inner border border-white/10 group-hover:border-white/20 transition-colors`}>
                            <img 
                                src={generatedImage.imageUrl} 
                                alt={generatedImage.prompt} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2px] gap-4">
                                <button 
                                    onClick={() => setIsFullScreen(true)}
                                    className="px-6 py-4 bg-gray-900/80 hover:bg-gray-800 backdrop-blur-xl border border-white/20 rounded-full text-white font-extrabold flex items-center gap-2 transition-all transform hover:scale-110 shadow-[0_0_30px_rgba(0,0,0,0.5)] active:scale-95"
                                >
                                    <Maximize2 className="w-6 h-6" />
                                </button>
                                <button 
                                    onClick={handleDownload}
                                    className="px-8 py-4 bg-white/10 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 backdrop-blur-xl border border-white/20 hover:border-transparent rounded-full text-white font-extrabold flex items-center gap-3 transition-all transform hover:scale-110 shadow-[0_0_30px_rgba(0,0,0,0.5)] active:scale-95"
                                >
                                    <Download className="w-6 h-6 animate-bounce" />
                                    Download High-Resolution
                                </button>
                            </div>
                        </div>

                        {/* Image Metadata Panel */}
                        <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-4 pb-2">
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-500/10 p-4 rounded-2xl border border-purple-500/20 shadow-inner">
                                    <ImageIcon className="w-7 h-7 text-purple-400 flex-shrink-0" />
                                </div>
                                <div>
                                    <h3 className="text-purple-400 font-black tracking-widest text-xs uppercase mb-1">PROMPT USED</h3>
                                    <p className="text-gray-100 text-lg md:text-xl font-light leading-relaxed max-w-2xl">{generatedImage.prompt}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* FULL SCREEN MODAL */}
            <AnimatePresence>
                {isFullScreen && generatedImage && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsFullScreen(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm cursor-zoom-out"
                    >
                        <motion.img 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            src={generatedImage.imageUrl} 
                            alt="Full Screen" 
                            className="max-w-full max-h-full rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)]" 
                        />
                        <div className="absolute top-6 right-8 flex gap-4">
                            <button onClick={(e) => { e.stopPropagation(); handleDownload(); }} className="bg-white/10 hover:bg-white/20 p-3 rounded-full text-white backdrop-blur-md transition">
                                <Download className="w-6 h-6" />
                            </button>
                        </div>
                        <p className="absolute bottom-6 left-0 right-0 text-center text-gray-400/50 uppercase tracking-widest text-sm pointer-events-none">
                            Click anywhere to close
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
