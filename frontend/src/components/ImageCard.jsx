import React, { useState } from 'react';
import { Download, Copy, Check, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import axios from 'axios';

const ImageCard = ({ image, onDelete }) => {
    const [copied, setCopied] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const handleDownload = () => {
        toast.success("Downloading image...");
        const link = document.createElement('a');
        link.href = image.imageUrl;
        link.download = `ai-image-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this masterpiece forever?')) return;
        setIsDeleting(true);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            if (!token) throw new Error("Unauthorized");
            await axios.delete(`http://localhost:5000/api/images/${image._id}`, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Image permanently discarded!");
            if (onDelete) onDelete(image._id);
        } catch (error) {
            toast.error("Failed to delete record");
            setIsDeleting(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(image.prompt);
        setCopied(true);
        toast.success("Prompt copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative rounded-2xl overflow-hidden glass aspect-square"
        >
            <img 
                src={image.imageUrl} 
                alt={image.prompt} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="text-white text-sm line-clamp-2 leading-relaxed">{image.prompt}</p>
                    <button 
                        onClick={handleCopy}
                        className="p-1.5 bg-white/10 hover:bg-purple-500/50 rounded-md backdrop-blur-sm transition-colors text-white flex-shrink-0"
                        title="Copy prompt"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-300 font-medium bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-md">
                        {new Date(image.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                        {!image._id.toString().startsWith('insp-') && (
                            <button 
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="p-2 bg-red-500/20 hover:bg-red-500/50 hover:text-white rounded-full backdrop-blur-md transition-all text-red-300"
                                title="Delete Image"
                            >
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin text-red-400" /> : <Trash2 className="w-4 h-4 text-[inherit]" />}
                            </button>
                        )}
                        <button 
                            onClick={handleDownload}
                            className="p-2 bg-blue-500/20 hover:bg-blue-600 hover:text-white rounded-full backdrop-blur-md transition-all text-blue-200"
                            title="Download Image"
                        >
                            <Download className="w-4 h-4 text-[inherit]" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ImageCard;
