import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    ProtectedRoute,
    AdminRoute,
    SuperAdminRoute,
} from "./UserInterFaceComponents/Common/ProtectedRoute.jsx";
import { fetchUser } from "./Store/slices/authSlice.js";
import NormalLayout from "./layouts/NormalLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminDashboard from "./Dashboards/AdminDashboard.jsx";
import SuperAdminDashboard from "./Dashboards/SuperAdminDashboard.jsx";
import SuperAdminLayout from "./Layouts/SuperAdminLayout.jsx";
import CheckOutUser from "./UserInterFaceComponents/Products/CheckOut/CheckOutUser.jsx";
import ProductDetails from "./UserInterFaceComponents/Products/ProductDetails.jsx";
import UserInterFace from "./UserInterFaceComponents/Common/UserInterFace.jsx";
import AuthCallback from "./pages/AuthCallback";
import UserProfile from "./UserInterFaceComponents/Common/UserProfile.jsx";
import Toast from "./UserInterFaceComponents/Common/Toast.jsx";
import OrderConfirmation from "./UserInterFaceComponents/Common/OrderConfirmation.jsx";

function App() {
    const dispatch = useDispatch();
    const { isLoading, appLoaded } = useSelector((state) => state.auth);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
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
                    <Route
                        path="/auth/google/callback"
                        element={<AuthCallback />}
                    />
                    <Route
                        path="/*"
                        element={
                            <NormalLayout>
                                <UserInterFace/>
                            </NormalLayout>
                        }
                    />
                    <Route
                        path="/checkout"
                        element={
                            <NormalLayout>
                                <ProtectedRoute>
                                    <CheckOutUser />
                                </ProtectedRoute>
                            </NormalLayout>
                        }
                    />
                    <Route
                        path="/order-confirmation"
                        element={
                            <NormalLayout>
                                <ProtectedRoute>
                                    <OrderConfirmation />
                                </ProtectedRoute>
                            </NormalLayout>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <NormalLayout>
                                <ProtectedRoute>
                                   <UserProfile/>
                                </ProtectedRoute>
                            </NormalLayout>
                        }
                    />
                    <Route
                        path="/productDetails/:id?"
                        element={
                            <NormalLayout>
                                <ProductDetails />
                            </NormalLayout>
                        }
                    />
                    <Route
                        path="/admin/*"
                        element={
                            <AdminRoute>
                                <AdminLayout>
                                    <AdminDashboard />
                                </AdminLayout>
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/super-admin/*"
                        element={
                            <SuperAdminRoute>
                                <SuperAdminLayout>
                                    <Routes>
                                        <Route
                                            index
                                            element={<SuperAdminDashboard />}
                                        />
                                    </Routes>
                                </SuperAdminLayout>
                            </SuperAdminRoute>
                        }
                    />
                    <Route
                        path="/unauthorized"
                        element={
                            <NormalLayout>
                                <div>Unauthorized Access</div>
                            </NormalLayout>
                        }
                    />
                </Routes>
                <Toast/>
            </div>
        </Router>
    );
}

export default App;
