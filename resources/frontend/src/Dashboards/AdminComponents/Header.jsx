import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, Search, LogOut, User, Settings } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../Store/slices/authSlice.js";

function Header() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
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
        navigate("/");
        setIsUserDropdownOpen(false);
    };

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-64 right-0 z-50">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1 max-w-2xl">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search products, orders, users..."
                                className="w-full pl-7 pr-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 ml-6">
                        <button className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleUserDropdown}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                                </div>
                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-medium">
                                        {user?.name?.charAt(0)?.toUpperCase()}
                                    </span>
                                </div>
                                <ChevronDown
                                    size={16}
                                    className={`text-gray-400 transition-transform duration-200 ${
                                        isUserDropdownOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            {isUserDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                        <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigate('/profile');
                                            setIsUserDropdownOpen(false);
                                        }}
                                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <User size={16} className="mr-3 text-gray-400" />
                                        Your Profile
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate('/admin/settings');
                                            setIsUserDropdownOpen(false);
                                        }}
                                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <Settings size={16} className="mr-3 text-gray-400" />
                                        Settings
                                    </button>

                                    <div className="border-t border-gray-100 mt-2 pt-2">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                        >
                                            <LogOut size={16} className="mr-3" />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
