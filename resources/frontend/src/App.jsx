import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ProtectedRoute, AdminRoute, SuperAdminRoute } from './components/ProtectedRoute';
import { fetchUser } from "./Store/slices/authSlice.js";
import NormalLayout from "./layouts/NormalLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import Home from "./Components/HomeComponent/Home.jsx";
import AdminDashboard from "./Dashboards/AdminDashboard.jsx";
import SuperAdminDashboard from "./Dashboards/SuperAdminDashboard.jsx";



function App() {
    const dispatch = useDispatch();
    const { isLoading, appLoaded } = useSelector((state) => state.auth);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(fetchUser()).finally(() => {
                setInitialLoad(false);
            });
        } else {
            setInitialLoad(false);
        }
    }, [dispatch]);

    if (initialLoad || (isLoading && !appLoaded)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Public Routes with Navbar */}
                    <Route path="/" element={
                        <NormalLayout>
                            <Home />
                        </NormalLayout>
                    } />
                    <Route path="/home" element={
                        <NormalLayout>
                            <Home />
                        </NormalLayout>
                    } />

                    <Route path="/checkout" element={
                        <NormalLayout>
                            <ProtectedRoute>
                                <div>Checkout Page</div>
                            </ProtectedRoute>
                        </NormalLayout>
                    } />

                    <Route path="/profile" element={
                        <NormalLayout>
                            <ProtectedRoute>
                                <div>User Profile</div>
                            </ProtectedRoute>
                        </NormalLayout>
                    } />

                    <Route path="/admin/*" element={
                        <AdminRoute>
                            <AdminLayout>
                                <Routes>
                                    <Route index element={<AdminDashboard />} />
                                </Routes>
                            </AdminLayout>
                        </AdminRoute>
                    } />

                    <Route path="/super-admin/*" element={
                        <SuperAdminRoute>
                            <AdminLayout>
                                <Routes>
                                    <Route index element={<SuperAdminDashboard/>} />
                                    <Route path="settings" element={<div>System Settings</div>} />
                                    <Route path="admins" element={<div>Manage Admins</div>} />
                                </Routes>
                            </AdminLayout>
                        </SuperAdminRoute>
                    } />

                    <Route path="/unauthorized" element={
                        <NormalLayout>
                            <div>Unauthorized Access</div>
                        </NormalLayout>
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
