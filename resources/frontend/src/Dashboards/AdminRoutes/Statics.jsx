
import React, { useState, useEffect } from 'react';
import MetricsGrid from "./Common/StaticsComponents/MetricsGrid.jsx";
import ChartsGrid from "./Common/StaticsComponents/ChartsGrid.jsx";
import RecentActivity from "./Common/StaticsComponents/RecentActivity.jsx";
import NotificationsPanel from "./Common/StaticsComponents/NotificationsPanel.jsx";


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
            { name: 'Completed', value: 65, color: '#059669' },
            { name: 'Pending', value: 20, color: '#D97706' },
            { name: 'Processing', value: 8, color: '#2563EB' },
            { name: 'Cancelled', value: 7, color: '#DC2626' }
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
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-7xl mx-auto">
                <MetricsGrid />
                <ChartsGrid
                    monthlyOrders={dashboardData.monthlyOrders}
                    ordersByStatus={dashboardData.ordersByStatus}
                    topSellingProducts={dashboardData.topSellingProducts}
                    mostViewedProducts={dashboardData.mostViewedProducts}
                />
                <RecentActivity
                    recentOrders={dashboardData.recentOrders}
                    recentUsers={dashboardData.recentUsers}
                />
                <NotificationsPanel
                    pendingOrders={dashboardData.summary.pendingOrders}
                    totalQuotations={dashboardData.summary.totalQuotations}
                />
            </div>
        </div>
    );
}

export default Statistics;
