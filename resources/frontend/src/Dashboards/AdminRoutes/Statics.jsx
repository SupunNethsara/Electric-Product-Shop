import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function Statistics() {
    const [dateRange, setDateRange] = useState('30days');
    const [loading, setLoading] = useState(true);

    // Mock data - replace with actual API calls
    const dashboardData = {
        summary: {
            totalOrders: 152,
            totalRevenue: 2450000,
            totalProducts: 300,
            totalUsers: 120,
            totalQuotations: 34,
            pendingOrders: 12
        },
        ordersByStatus: [
            { name: 'Completed', value: 65, color: '#10B981' },
            { name: 'Pending', value: 20, color: '#F59E0B' },
            { name: 'Processing', value: 8, color: '#3B82F6' },
            { name: 'Cancelled', value: 7, color: '#EF4444' }
        ],
        monthlyOrders: [
            { month: 'Jan', orders: 45, revenue: 680000 },
            { month: 'Feb', orders: 52, revenue: 720000 },
            { month: 'Mar', orders: 48, revenue: 690000 },
            { month: 'Apr', orders: 65, revenue: 890000 },
            { month: 'May', orders: 58, revenue: 820000 },
            { month: 'Jun', orders: 72, revenue: 1050000 }
        ],
        topSellingProducts: [
            { name: 'Laptop 3', orders: 25, revenue: 7500000 },
            { name: 'Headphone X', orders: 18, revenue: 540000 },
            { name: 'Smartphone Pro', orders: 15, revenue: 1200000 },
            { name: 'Tablet Mini', orders: 12, revenue: 480000 },
            { name: 'Monitor 27"', orders: 10, revenue: 600000 }
        ],
        mostViewedProducts: [
            { name: 'Laptop 3', views: 1245 },
            { name: 'Smartphone Pro', views: 987 },
            { name: 'Headphone X', views: 856 },
            { name: 'Tablet Mini', views: 723 },
            { name: 'Monitor 27"', views: 654 }
        ],
        recentOrders: [
            { id: 1, code: 'ORD-1761982565', customer: 'Pasindu Prabath', amount: 300300, status: 'completed', date: '2025-11-01' },
            { id: 2, code: 'ORD-1761982566', customer: 'John Doe', amount: 150000, status: 'pending', date: '2025-10-30' },
            { id: 3, code: 'ORD-1761982567', customer: 'Jane Smith', amount: 450000, status: 'processing', date: '2025-10-29' },
            { id: 4, code: 'ORD-1761982568', customer: 'Mike Johnson', amount: 200000, status: 'completed', date: '2025-10-28' }
        ],
        recentUsers: [
            { id: 1, name: 'Pasindu Prabath', email: 'pasindu@gmail.com', date: '2025-10-24' },
            { id: 2, name: 'John Doe', email: 'john@example.com', date: '2025-10-23' },
            { id: 3, name: 'Jane Smith', email: 'jane@example.com', date: '2025-10-22' }
        ]
    };

    useEffect(() => {
        // Simulate API call
        setTimeout(() => setLoading(false), 1000);
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            completed: 'bg-green-100 text-green-800 border border-green-200',
            pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
            processing: 'bg-blue-100 text-blue-800 border border-blue-200',
            cancelled: 'bg-red-100 text-red-800 border border-red-200'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[1,2,3,4].map(i => (
                                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-600 mt-2">Real-time analytics and performance metrics</p>
                </div>

                <div className="mb-6 flex justify-between items-center">
                    <div className="flex space-x-3">
                        <button className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Export PDF</span>
                        </button>
                        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Export Excel</span>
                        </button>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Orders */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{dashboardData.summary.totalOrders}</p>
                                <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(dashboardData.summary.totalRevenue)}</p>
                                <p className="text-xs text-green-600 mt-1">↑ 8% from last month</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Total Products */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Products</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{dashboardData.summary.totalProducts}</p>
                                <p className="text-xs text-gray-600 mt-1">123 Active • 177 Inactive</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Registered Users */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Registered Users</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{dashboardData.summary.totalUsers}</p>
                                <p className="text-xs text-green-600 mt-1">↑ 5 new this week</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Orders Trend */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Orders Trend</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dashboardData.monthlyOrders}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value) => [value, 'Orders']}
                                        labelFormatter={(label) => `Month: ${label}`}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="orders"
                                        stroke="#3B82F6"
                                        strokeWidth={2}
                                        name="Orders"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Orders by Status */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders by Status</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dashboardData.ordersByStatus}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {dashboardData.ordersByStatus.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Bottom Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Top Selling Products */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dashboardData.topSellingProducts}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value) => [value, 'Orders']}
                                    />
                                    <Legend />
                                    <Bar dataKey="orders" fill="#10B981" name="Number of Orders" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Most Viewed Products */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Viewed Products</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dashboardData.mostViewedProducts} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis type="category" dataKey="name" width={80} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="views" fill="#8B5CF6" name="Views" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                View All →
                            </button>
                        </div>
                        <div className="space-y-4">
                            {dashboardData.recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{order.code}</p>
                                        <p className="text-sm text-gray-500">{order.customer}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">{formatCurrency(order.amount)}</p>
                                        <div className="mt-1">{getStatusBadge(order.status)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Users */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                View All →
                            </button>
                        </div>
                        <div className="space-y-4">
                            {dashboardData.recentUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">{formatDate(user.date)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Notifications Panel */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">Attention Required</h4>
                                <p className="text-sm text-gray-600">
                                    {dashboardData.summary.pendingOrders} orders pending review • {dashboardData.summary.totalQuotations} quotations awaiting response
                                </p>
                            </div>
                        </div>
                        <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium">
                            Review Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Statistics;
