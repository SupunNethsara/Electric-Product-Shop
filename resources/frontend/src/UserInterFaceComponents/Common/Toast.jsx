import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { removeToast } from '../../Store/slices/toastSlice';

const Toast = () => {
    const dispatch = useDispatch();
    const { toasts } = useSelector((state) => state.toast);

    useEffect(() => {
        const autoRemoveIntervals = toasts.map(toast => {
            if (toast.autoHide !== false) {
                return setTimeout(() => {
                    dispatch(removeToast(toast.id));
                }, toast.duration || 5000);
            }
            return null;
        });

        return () => {
            autoRemoveIntervals.forEach(interval => {
                if (interval) clearTimeout(interval);
            });
        };
    }, [toasts, dispatch]);

    const getToastIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-500" />;
            default:
                return <Info className="w-5 h-5 text-gray-500" />;
        }
    };

    const getToastStyles = (type) => {
        const baseStyles = "max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden";

        switch (type) {
            case 'success':
                return `${baseStyles} border-l-4 border-green-500`;
            case 'error':
                return `${baseStyles} border-l-4 border-red-500`;
            case 'warning':
                return `${baseStyles} border-l-4 border-yellow-500`;
            case 'info':
                return `${baseStyles} border-l-4 border-blue-500`;
            default:
                return `${baseStyles} border-l-4 border-gray-500`;
        }
    };

    if (toasts.length === 0) return null;

    const handleConfirm = (toast, confirm) => {
        if (confirm && typeof confirm.onClick === 'function') {
            confirm.onClick();
        }
        dispatch(removeToast(toast.id));
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-3 w-full max-w-sm">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`${getToastStyles(toast.type)} w-full`}
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                >
                    <div className="p-3 sm:p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 mt-0.5">
                                {getToastIcon(toast.type)}
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                {toast.title && (
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {toast.title}
                                    </p>
                                )}
                                {toast.message && (
                                    <p className="mt-0.5 text-sm text-gray-600 break-words">
                                        {toast.message}
                                    </p>
                                )}
                                {toast.isConfirm && (
                                    <div className="mt-3 flex justify-end space-x-2">
                                        <button
                                            onClick={() => handleConfirm(toast, toast.confirm)}
                                            className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                                        >
                                            {toast.confirm?.text || 'Confirm'}
                                        </button>
                                        <button
                                            onClick={() => dispatch(removeToast(toast.id))}
                                            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                                        >
                                            {toast.cancelText || 'Cancel'}
                                        </button>
                                    </div>
                                )}
                            </div>
                            {!toast.isConfirm && (
                                <div className="ml-2 flex-shrink-0 flex">
                                    <button
                                        onClick={() => dispatch(removeToast(toast.id))}
                                        className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-200"
                                    >
                                        <span className="sr-only">Close</span>
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Toast;
