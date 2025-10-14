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
import Home from "./Components/HomeComponent/Home.jsx";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
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
                    <Route path="/" element={<Home/>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/products" element={<Products />} />

                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute>
                                <div>Checkout Page</div>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/*"
                        element={
                            <AdminRoute>
                                <div>Admin Dashboard</div>
                            </AdminRoute>
                        }
                    />

                    <Route
                        path="/super-admin/*"
                        element={
                            <SuperAdminRoute>
                                <div>Super Admin Dashboard</div> {/* Add actual super admin component */}
                            </SuperAdminRoute>
                        }
                    />
                    <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
