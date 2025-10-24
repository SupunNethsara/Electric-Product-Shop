import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import {openLoginModal} from "../../../Store/slices/modalSlice.js";


function CheckOutUser() {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        dispatch(openLoginModal('/checkout'));
        return <Navigate to="/" replace />;
    }

    return (
        <div className='flex p-20 flex-col min-h-screen'>
            Checkout Page - User is authenticated
        </div>
    );
}

export default CheckOutUser;
