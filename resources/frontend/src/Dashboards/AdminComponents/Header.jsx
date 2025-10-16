import React from 'react';
import {Bell, ChevronDown, Search} from "lucide-react";
import {useSelector} from "react-redux";

function Header() {
    const { user } = useSelector((state) => state.auth);
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1 max-w-2xl">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search products, orders, users..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 ml-6">
                        <button className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="flex items-center space-x-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                            </div>
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-medium">
                                        {user?.name?.charAt(0)?.toUpperCase()}
                                    </span>
                            </div>
                            <ChevronDown size={16} className="text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
