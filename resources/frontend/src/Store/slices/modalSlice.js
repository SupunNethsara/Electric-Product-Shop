import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
    name: 'modal',
    initialState: {
        isLoginModalOpen: false,
        isRegisterModalOpen: false,
        redirectAfterLogin: null,
    },
    reducers: {
        openLoginModal: (state, action) => {
            state.isLoginModalOpen = true;
            state.isRegisterModalOpen = false;
            state.redirectAfterLogin = action.payload || null;
        },
        openRegisterModal: (state, action) => {
            state.isRegisterModalOpen = true;
            state.isLoginModalOpen = false;
            state.redirectAfterLogin = action.payload || null;
        },
        closeModals: (state) => {
            state.isLoginModalOpen = false;
            state.isRegisterModalOpen = false;
            state.redirectAfterLogin = null;
        },
        switchToRegister: (state) => {
            state.isLoginModalOpen = false;
            state.isRegisterModalOpen = true;
        },
        switchToLogin: (state) => {
            state.isRegisterModalOpen = false;
            state.isLoginModalOpen = true;
        },
        clearRedirect: (state) => {
            state.redirectAfterLogin = null;
        },
    },
});

export const {
    openLoginModal,
    openRegisterModal,
    closeModals,
    switchToRegister,
    switchToLogin,
    clearRedirect,
} = modalSlice.actions;

export default modalSlice.reducer;
