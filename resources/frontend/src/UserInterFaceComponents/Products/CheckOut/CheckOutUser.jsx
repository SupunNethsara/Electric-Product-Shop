import React from 'react';
import {useSelector} from "react-redux";

function CheckOutUser() {
    const { isAuthenticated, role } = useSelector((state) => state.auth);
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return (
        <div className='flex p-20 flex-col min-h-screen'>CheckOut Users</div>
    );
}

export default CheckOutUser;
