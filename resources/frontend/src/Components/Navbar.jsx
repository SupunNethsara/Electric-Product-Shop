import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../Store/slices/authSlice.js";
import { useState, useEffect, useRef } from "react";
import LoginModal from "../Pages/Login.jsx";
import RegisterModal from "../Pages/Register.jsx";
import { Search, ShoppingCart, Menu, X } from "lucide-react";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, role, isLoading } = useSelector((state) => state.auth);
    const cartCount = useSelector(state => state.cart?.total || 0);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/home");
        setIsUserDropdownOpen(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
        }
    };

    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

    const openLoginModal = () => {
        setIsLoginModalOpen(true);
        setIsRegisterModalOpen(false);
    };

    const openRegisterModal = () => {
        setIsRegisterModalOpen(true);
        setIsLoginModalOpen(false);
    };

    const closeModals = () => {
        setIsLoginModalOpen(false);
        setIsRegisterModalOpen(false);
    };

    const switchToRegister = () => {
        setIsLoginModalOpen(false);
        setIsRegisterModalOpen(true);
    };

    const switchToLogin = () => {
        setIsRegisterModalOpen(false);
        setIsLoginModalOpen(true);
    };

    const navLinks = [
        { path: "/", label: "Home" },
        { path: "/shop", label: "Shop" },
        { path: "/about", label: "About" },
        { path: "/contact", label: "Contact" },
    ];

    const getDashboardLink = () => {
        if (role === "super_admin") return "/super-admin";
        if (role === "admin") return "/admin";
        return "/profile";
    };

    const getDashboardLabel = () => {
        if (role === "super_admin") return "Super Admin";
        if (role === "admin") return "Dashboard";
        return "Profile";
    };
    if (isLoading && !isAuthenticated) {
        return (
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="text-2xl font-semibold text-slate-700">
                            <span className="text-green-600">go</span>cart
                            <span className="text-green-600 text-3xl">.</span>
                        </Link>
                        <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <>
            <nav className="relative bg-white">
                <div className="mx-6">
                    <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">
                        <Link
                            to="/"
                            className="relative float-left text-4xl font-semibold text-slate-700"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <span className="text-green-600">go</span>cart
                            <span className="text-green-600 text-5xl leading-0">.</span>
                            <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                                plus
                            </p>
                        </Link>

                        <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`font-medium transition-colors duration-200 hover:text-green-600 ${
                                        isActiveRoute(link.path) ? "text-green-600" : "text-slate-600"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                                <Search size={18} className="text-slate-600" />
                                <input
                                    className="w-full bg-transparent outline-none placeholder-slate-600"
                                    type="text"
                                    placeholder="Search products"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    required
                                />
                            </form>
                            <Link
                                to="/cart"
                                className="relative flex items-center gap-2 text-slate-600 hover:text-green-600 transition-colors duration-200"
                            >
                                <ShoppingCart size={18} />
                                Cart
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {isAuthenticated ? (
                                <div className="flex items-center" ref={dropdownRef}>
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                            className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-2 hover:border-slate-300 transition-all duration-300"
                                        >
                                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">
                                                    {user?.name?.charAt(0)?.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-start">
                                                <span className="text-slate-900 font-medium text-sm">
                                                    {user?.name}
                                                </span>
                                                <span className="text-slate-500 text-xs capitalize">
                                                    {role}
                                                </span>
                                            </div>
                                        </button>

                                        {isUserDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                                                <div className="px-4 py-3 border-b border-slate-100">
                                                    <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                                                    <p className="text-sm text-slate-500 capitalize">{role}</p>
                                                </div>

                                                <Link
                                                    to={getDashboardLink()}
                                                    className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                                                    onClick={() => setIsUserDropdownOpen(false)}
                                                >
                                                    <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    {getDashboardLabel()}
                                                </Link>

                                                {role === "user" && (
                                                    <Link
                                                        to="/orders"
                                                        className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                                                        onClick={() => setIsUserDropdownOpen(false)}
                                                    >
                                                        <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                        </svg>
                                                        My Orders
                                                    </Link>
                                                )}

                                                {(role === "admin" || role === "super_admin") && (
                                                    <>
                                                        <Link
                                                            to="/admin/products"
                                                            className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                                                            onClick={() => setIsUserDropdownOpen(false)}
                                                        >
                                                            <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                            </svg>
                                                            Manage Products
                                                        </Link>
                                                        <Link
                                                            to="/admin/users"
                                                            className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                                                            onClick={() => setIsUserDropdownOpen(false)}
                                                        >
                                                            <svg className="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                                            </svg>
                                                            Manage Users
                                                        </Link>
                                                    </>
                                                )}

                                                <div className="border-t border-slate-100 mt-2 pt-2">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                                    >
                                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                        </svg>
                                                        Logout
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={openLoginModal}
                                        className="px-6 py-2 text-slate-700 hover:text-green-600 font-medium transition-colors duration-200"
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={openRegisterModal}
                                        className="px-8 py-2 bg-green-500 hover:bg-green-600 transition text-white rounded-full font-medium"
                                    >
                                        Get Started
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="sm:hidden flex items-center gap-4">
                            <Link
                                to="/cart"
                                className="relative p-2 text-slate-600"
                            >
                                <ShoppingCart size={20} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 text-[8px] text-white bg-slate-600 size-3.5 rounded-full flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {!isAuthenticated && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={openLoginModal}
                                        className="px-4 py-1.5 text-slate-700 hover:text-green-600 text-sm transition-colors duration-200 font-medium"
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        onClick={openRegisterModal}
                                        className="px-5 py-1.5 bg-green-500 hover:bg-green-600 text-sm transition text-white rounded-full font-medium"
                                    >
                                        Get Started
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 text-slate-600 hover:text-green-600 transition-colors duration-300"
                            >
                                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="sm:hidden border-t border-slate-200 bg-white">
                        <div className="px-6 py-4">
                            <form onSubmit={handleSearch} className="flex items-center w-full text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full mb-4">
                                <Search size={18} className="text-slate-600" />
                                <input
                                    className="w-full bg-transparent outline-none placeholder-slate-600"
                                    type="text"
                                    placeholder="Search products"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    required
                                />
                            </form>

                            <div className="flex flex-col space-y-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`py-3 px-4 font-medium transition-all duration-200 rounded-lg ${
                                            isActiveRoute(link.path)
                                                ? "text-green-600 bg-green-50"
                                                : "text-slate-600 hover:text-green-600 hover:bg-slate-50"
                                        }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}

                                {isAuthenticated && (
                                    <>
                                        <div className="border-t border-slate-200 pt-3 mt-2">
                                            <Link
                                                to={getDashboardLink()}
                                                className="py-3 px-4 font-medium text-slate-600 hover:text-green-600 hover:bg-slate-50 transition-all duration-200 block rounded-lg"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {getDashboardLabel()}
                                            </Link>
                                            <Link
                                                to="/orders"
                                                className="py-3 px-4 font-medium text-slate-600 hover:text-green-600 hover:bg-slate-50 transition-all duration-200 block rounded-lg"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                My Orders
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className="w-full text-left py-3 px-4 font-medium text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                )}

                                {!isAuthenticated && (
                                    <div className="border-t border-slate-200 pt-3 mt-2">
                                        <button
                                            onClick={() => {
                                                openLoginModal();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full text-left py-3 px-4 font-medium text-slate-600 hover:text-green-600 hover:bg-slate-50 transition-all duration-200 rounded-lg"
                                        >
                                            Sign In
                                        </button>
                                        <button
                                            onClick={() => {
                                                openRegisterModal();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full text-left py-3 px-4 font-medium text-green-600 hover:bg-green-50 transition-all duration-200 rounded-lg"
                                        >
                                            Get Started
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={closeModals}
                onSwitchToRegister={switchToRegister}
            />

            <RegisterModal
                isOpen={isRegisterModalOpen}
                onClose={closeModals}
                onSwitchToLogin={switchToLogin}
            />
        </>
    );
};

export default Navbar;
