// components/Navbar.jsx
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {logoutUser} from "../Store/slices/authSlice.js";


const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user, role } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold text-gray-800">
                            E-Commerce
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link to="/products" className="text-gray-600 hover:text-gray-900">
                            Products
                        </Link>

                        {isAuthenticated ? (
                            <>
                                {role === 'user' && (
                                    <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                                        Profile
                                    </Link>
                                )}

                                {(role === 'admin' || role === 'super_admin') && (
                                    <Link to="/admin" className="text-gray-600 hover:text-gray-900">
                                        Admin Dashboard
                                    </Link>
                                )}

                                {role === 'super_admin' && (
                                    <Link to="/super-admin" className="text-gray-600 hover:text-gray-900">
                                        Super Admin
                                    </Link>
                                )}

                                <span className="text-gray-600">Hello, {user?.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                >
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
