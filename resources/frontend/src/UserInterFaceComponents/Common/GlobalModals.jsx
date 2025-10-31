import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoginModal from "../../Modals/Login.jsx";
import RegisterModal from "../../Modals/Register.jsx";
import { closeModals ,switchToRegister ,switchToLogin } from "../../Store/slices/modalSlice.js";



const GlobalModals = () => {
    const dispatch = useDispatch();
    const { isLoginModalOpen, isRegisterModalOpen } = useSelector((state) => state.modal);

    return (
        <>
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => dispatch(closeModals())}
                onSwitchToRegister={() => dispatch(switchToRegister())}
            />

            <RegisterModal
                isOpen={isRegisterModalOpen}
                onClose={() => dispatch(closeModals())}
                onSwitchToLogin={() => dispatch(switchToLogin())}
            />
        </>
    );
};

export default GlobalModals;
