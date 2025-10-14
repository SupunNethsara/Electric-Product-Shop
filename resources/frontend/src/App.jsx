// App.jsx
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { ProtectedRoute, AdminRoute, SuperAdminRoute } from './components/ProtectedRoute';
import { fetchUser } from "./Store/slices/authSlice.js";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import Navbar from "./Components/Navbar.jsx";
import Products from "./Components/Products.jsx";
import ProductCard from "./Components/ProductCard.jsx";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        // Check if user is logged in on app load
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(fetchUser());
        }
    }, [dispatch]);

    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<div>Home</div>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/products" element={<Products />} /> {/* Fixed: Use Products component */}

                    {/* Protected routes */}
                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute>
                                <div>Checkout Page</div> {/* Add actual checkout component */}
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin routes */}
                    <Route
                        path="/admin/*"
                        element={
                            <AdminRoute>
                                <div>Admin Dashboard</div> {/* Add actual admin component */}
                            </AdminRoute>
                        }
                    />

                    {/* Super Admin routes */}
                    <Route
                        path="/super-admin/*"
                        element={
                            <SuperAdminRoute>
                                <div>Super Admin Dashboard</div> {/* Add actual super admin component */}
                            </SuperAdminRoute>
                        }
                    />

                    {/* Add unauthorized route */}
                    <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
