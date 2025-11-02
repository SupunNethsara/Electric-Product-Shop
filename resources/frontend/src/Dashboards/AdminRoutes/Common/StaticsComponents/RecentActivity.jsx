import React from 'react';

function RecentActivity({ recentOrders, recentUsers }) {
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
            completed: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
            pending: 'bg-amber-100 text-amber-800 border border-amber-200',
            processing: 'bg-blue-100 text-blue-800 border border-blue-200',
            cancelled: 'bg-red-100 text-red-800 border border-red-200'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-emerald-900">Recent Orders</h3>
                    <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                        View All →
                    </button>
                </div>
                <div className="space-y-4">
                    {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 border border-emerald-100 rounded-lg hover:bg-emerald-50 transition-colors">
                            <div>
                                <p className="font-medium text-emerald-900">{order.code}</p>
                                <p className="text-sm text-emerald-600">{order.customer}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-emerald-900">{formatCurrency(order.amount)}</p>
                                <div className="mt-1">{getStatusBadge(order.status)}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-emerald-900">Recent Users</h3>
                    <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                        View All →
                    </button>
                </div>
                <div className="space-y-4">
                    {recentUsers.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 border border-emerald-100 rounded-lg hover:bg-emerald-50 transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-medium text-emerald-700">
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-emerald-900">{user.name}</p>
                                    <p className="text-sm text-emerald-600">{user.email}</p>
                                </div>
                            </div>
                            <span className="text-sm text-emerald-600">{formatDate(user.date)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default RecentActivity;
