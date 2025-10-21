import React from 'react';
import {useSelector} from "react-redux";

function CheckOutUser() {
    const { isAuthenticated, role } = useSelector((state) => state.auth);
    return (
        <div className='flex p-20 flex-col min-h-screen'>CheckOut Users</div>
    );
}

export default CheckOutUser;
