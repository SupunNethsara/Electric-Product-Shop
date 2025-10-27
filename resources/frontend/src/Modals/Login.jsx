import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from "../Store/slices/authSlice.js";
import { closeModals, clearRedirect } from "../Store/slices/modalSlice.js";
import { useNavigate } from "react-router-dom";
import { X, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { redirectAfterLogin } = useSelector((state) => state.modal);
    const { isLoading, error, isAuthenticated, role } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && isOpen) {
            dispatch(closeModals());

            if (redirectAfterLogin) {
                if ((redirectAfterLogin.includes('admin') && role !== 'admin' && role !== 'super_admin') ||
                    (redirectAfterLogin.includes('super-admin') && role !== 'super_admin')) {
                    navigate('/');
                    dispatch(clearRedirect());
                    return;
                }
                navigate(redirectAfterLogin);
                dispatch(clearRedirect());
            } else {
                if (role === 'super_admin') {
                    navigate('/super-admin');
                } else if (role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            }
        }
    }, [isAuthenticated, isOpen, navigate, role, redirectAfterLogin, dispatch]);

    useEffect(() => {
        if (isOpen) {
            dispatch(clearError());
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, dispatch]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 overflow-hidden">
                <div className="relative bg-gradient-to-r from-green-500 to-green-600 p-8">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all duration-200 text-white"
                    >
                        <X size={20} />
                    </button>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-green-100">
                            Sign in to your account to continue
                        </p>
                    </div>
                </div>
                <form className="p-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail
                                    size={20}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-slate-50/50"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock
                                    size={20}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="w-full pl-12 pr-12 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-slate-50/50"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/25"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 size={20} className="animate-spin" />
                                Signing in...
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </button>

                    <div className="text-center pt-4 border-t border-slate-100">
                        <p className="text-slate-600">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={onSwitchToRegister}
                                className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-200"
                            >
                                Create one now
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
