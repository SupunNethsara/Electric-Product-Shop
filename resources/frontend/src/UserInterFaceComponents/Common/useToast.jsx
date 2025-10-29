import { useDispatch } from 'react-redux';
import {addToast} from "../../Store/slices/toastSlice.js";


export const useToast = () => {
    const dispatch = useDispatch();

    const showToast = (options) => {
        dispatch(addToast(options));
    };

    const success = (message, title = 'Success', options = {}) => {
        showToast({
            type: 'success',
            title,
            message,
            ...options,
        });
    };

    const error = (message, title = 'Error', options = {}) => {
        showToast({
            type: 'error',
            title,
            message,
            ...options,
        });
    };

    const warning = (message, title = 'Warning', options = {}) => {
        showToast({
            type: 'warning',
            title,
            message,
            ...options,
        });
    };

    const info = (message, title = 'Info', options = {}) => {
        showToast({
            type: 'info',
            title,
            message,
            ...options,
        });
    };

    return {
        showToast,
        success,
        error,
        warning,
        info,
    };
};

export default useToast;
