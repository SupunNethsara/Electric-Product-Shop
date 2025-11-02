import React from 'react';

function MetricsGrid({ data }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const metrics = [
        {
            title: 'Total Orders',
            value: data.totalOrders,
            change: '↑ 12% from last month',
            changeColor: 'text-emerald-600',
            icon: (
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
            bgColor: 'bg-emerald-100'
        },
        {
            title: 'Total Revenue',
            value: formatCurrency(data.totalRevenue),
            change: '↑ 8% from last month',
            changeColor: 'text-emerald-600',
            icon: (
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
            ),
            bgColor: 'bg-emerald-100'
        },
        {
            title: 'Total Products',
            value: data.totalProducts,
            change: '123 Active • 177 Inactive',
            changeColor: 'text-emerald-700',
            icon: (
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            bgColor: 'bg-emerald-100'
        },
        {
            title: 'Registered Users',
            value: data.totalUsers,
            change: '↑ 5 new this week',
            changeColor: 'text-emerald-600',
            icon: (
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            ),
            bgColor: 'bg-emerald-100'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-emerald-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-emerald-700">{metric.title}</p>
                            <p className="text-2xl font-bold text-emerald-900 mt-1">{metric.value}</p>
                            <p className={`text-xs ${metric.changeColor} mt-1`}>{metric.change}</p>
                        </div>
                        <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                            {metric.icon}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MetricsGrid;
