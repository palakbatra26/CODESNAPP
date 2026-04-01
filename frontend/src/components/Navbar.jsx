import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, LogOut, History as HistoryIcon, ShieldAlert } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 w-full glass z-50 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                        AI Vision
                    </Link>
                    
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Generate</Link>
                                <Link to="/history" className="text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
                                    <HistoryIcon className="w-4 h-4" /> History
                                </Link>
                                {user.isAdmin && (
                                    <Link to="/admin" className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium flex items-center gap-1">
                                        <ShieldAlert className="w-4 h-4" /> Admin
                                    </Link>
                                )}
                                <div className="h-6 w-px bg-gray-700 mx-2"></div>
                                <span className="text-sm text-gray-400">Hi, {user.name.split(' ')[0]}</span>
                                <button 
                                    onClick={handleLogout}
                                    className="ml-2 p-2 text-gray-400 hover:text-red-400 transition-colors rounded-full hover:bg-gray-800"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Login</Link>
                                <Link to="/signup" className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
