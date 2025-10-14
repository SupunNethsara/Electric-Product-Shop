import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from "../Store/slices/authSlice.js";
import { useState, useEffect } from 'react';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, role } = useSelector((state) => state.auth);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/shop', label: 'Shop' },
        { path: '/about', label: 'About' },
        { path: '/contact', label: 'Contact' }
    ];

    return (
        <nav className={`bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-500 sticky top-0 z-50 ${
            isScrolled ? 'shadow-lg py-2' : 'shadow-sm py-3'
        }`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="flex items-center space-x-2 group"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                    <span className="text-white font-bold text-lg">go</span>
                                </div>
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-300">
                                Cart
                            </span>
                        </Link>
                    </div>

                    <div className="hidden xl:flex items-center space-x-8 flex-1 justify-center">
                        <div className="flex items-center space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative px-6 py-3 font-medium rounded-2xl transition-all duration-300 ${
                                        isActiveRoute(link.path)
                                            ? 'text-blue-600 bg-blue-50/80 shadow-sm'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50/80'
                                    }`}
                                >
                                    {link.label}
                                    {isActiveRoute(link.path) && (
                                        <span className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center space-x-6 flex-1 justify-end">
                        <form onSubmit={handleSearch} className="relative">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-64 pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 group-hover:bg-white group-hover:shadow-md"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </form>

                        <Link
                            to="/cart"
                            className="relative p-3 rounded-2xl bg-gray-50/80 hover:bg-white border border-transparent hover:border-gray-200 transition-all duration-300 group"
                        >
                            <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-sm">
                                3
                            </span>
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 border-r border-gray-200 pr-6">
                                    {role === 'user' && (
                                        <Link
                                            to="/profile"
                                            className={`px-4 py-2 font-medium rounded-xl transition-all duration-300 ${
                                                isActiveRoute('/profile')
                                                    ? 'text-blue-600 bg-blue-50/80 shadow-sm'
                                                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50/80'
                                            }`}
                                        >
                                            Profile
                                        </Link>
                                    )}

                                    {(role === 'admin' || role === 'super_admin') && (
                                        <Link
                                            to="/admin"
                                            className={`px-4 py-2 font-medium rounded-xl transition-all duration-300 ${
                                                isActiveRoute('/admin')
                                                    ? 'text-blue-600 bg-blue-50/80 shadow-sm'
                                                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50/80'
                                            }`}
                                        >
                                            Dashboard
                                        </Link>
                                    )}

                                    {role === 'super_admin' && (
                                        <Link
                                            to="/super-admin"
                                            className={`px-4 py-2 font-medium rounded-xl transition-all duration-300 ${
                                                isActiveRoute('/super-admin')
                                                    ? 'text-blue-600 bg-blue-50/80 shadow-sm'
                                                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50/80'
                                            }`}
                                        >
                                            Super Admin
                                        </Link>
                                    )}
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100/80 rounded-2xl px-4 py-2 border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                                            <span className="text-white text-sm font-medium">
                                                {user?.name?.charAt(0)?.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 font-medium text-sm">
                                                {user?.name}
                                            </span>
                                            <span className="text-gray-500 text-xs capitalize">
                                                {role}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-2xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-red-600/20 hover:border-red-700/30"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-blue-600 font-medium transition-all duration-300 px-6 py-2.5 rounded-2xl hover:bg-gray-50/80 border border-transparent hover:border-gray-200"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-7 py-2.5 rounded-2xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border border-blue-600/20 hover:border-blue-700/30"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="lg:hidden flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                            <Link
                                to="/cart"
                                className="relative p-2 rounded-xl bg-gray-50 hover:bg-white transition-all duration-300"
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                                    3
                                </span>
                            </Link>
                        </div>

                        {isAuthenticated && (
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                                <span className="text-white text-sm font-medium">
                                    {user?.name?.charAt(0)?.toUpperCase()}
                                </span>
                            </div>
                        )}

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:border-gray-300"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="lg:hidden py-6 border-t border-gray-200 bg-white/95 backdrop-blur-md mt-4 rounded-3xl shadow-2xl mx-2">
                        <div className="px-6 mb-6">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </form>
                        </div>

                        <div className="flex flex-col space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`py-4 px-6 font-medium rounded-xl transition-all duration-300 mx-2 ${
                                        isActiveRoute(link.path)
                                            ? 'text-blue-600 bg-blue-50/80 border border-blue-100 shadow-sm'
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50/80'
                                    }`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {isAuthenticated ? (
                                <>
                                    <div className="border-t border-gray-200 pt-4 mt-2">
                                        {role === 'user' && (
                                            <Link
                                                to="/profile"
                                                className={`py-4 px-6 font-medium rounded-xl transition-all duration-300 block mx-2 ${
                                                    isActiveRoute('/profile')
                                                        ? 'text-blue-600 bg-blue-50/80 border border-blue-100 shadow-sm'
                                                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50/80'
                                                }`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Profile
                                            </Link>
                                        )}

                                        {(role === 'admin' || role === 'super_admin') && (
                                            <Link
                                                to="/admin"
                                                className={`py-4 px-6 font-medium rounded-xl transition-all duration-300 block mx-2 ${
                                                    isActiveRoute('/admin')
                                                        ? 'text-blue-600 bg-blue-50/80 border border-blue-100 shadow-sm'
                                                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50/80'
                                                }`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Dashboard
                                            </Link>
                                        )}

                                        {role === 'super_admin' && (
                                            <Link
                                                to="/super-admin"
                                                className={`py-4 px-6 font-medium rounded-xl transition-all duration-300 block mx-2 ${
                                                    isActiveRoute('/super-admin')
                                                        ? 'text-blue-600 bg-blue-50/80 border border-blue-100 shadow-sm'
                                                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50/80'
                                                }`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Super Admin
                                            </Link>
                                        )}
                                    </div>

                                    <div className="pt-6 border-t border-gray-200 mt-2">
                                        <div className="flex items-center space-x-4 mb-4 px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/80 rounded-2xl mx-2">
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                                                <span className="text-white font-medium">
                                                    {user?.name?.charAt(0)?.toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-gray-900 font-medium">{user?.name}</p>
                                                <p className="text-gray-500 text-sm capitalize">{role}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-2xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg text-center border border-red-600/20 mx-2"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col space-y-3 pt-6 border-t border-gray-200 mt-2">
                                    <Link
                                        to="/login"
                                        className="text-gray-600 hover:text-blue-600 font-medium transition-all duration-300 py-4 px-6 rounded-xl hover:bg-gray-50/80 text-center border border-gray-200 mx-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-2xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg text-center border border-blue-600/20 mx-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
