import React from 'react';
import { useDispatch } from 'react-redux';
import { closeModals, confirmAction, cancelAction } from '../Store/slices/modalSlice';

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
    const dispatch = useDispatch();

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        dispatch(confirmAction());
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        dispatch(cancelAction());
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-medium mb-4">Confirm Action</h3>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
