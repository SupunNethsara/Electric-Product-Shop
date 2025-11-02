import React from 'react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function ChartsGrid({ monthlyOrders, ordersByStatus, topSellingProducts, mostViewedProducts }) {
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-200">
                    <h3 className="text-lg font-semibold text-emerald-900 mb-4">Monthly Orders Trend</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyOrders}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="month" stroke="#047857" />
                                <YAxis stroke="#047857" />
                                <Tooltip
                                    formatter={(value) => [value, 'Orders']}
                                    labelFormatter={(label) => `Month: ${label}`}
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #059669',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#059669"
                                    strokeWidth={3}
                                    name="Orders"
                                    dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-200">
                    <h3 className="text-lg font-semibold text-emerald-900 mb-4">Orders by Status</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ordersByStatus}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {ordersByStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => [`${value}%`, 'Percentage']}
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #059669',
                                        borderRadius: '8px'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-200">
                    <h3 className="text-lg font-semibold text-emerald-900 mb-4">Top Selling Products</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topSellingProducts}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="name" stroke="#047857" />
                                <YAxis stroke="#047857" />
                                <Tooltip
                                    formatter={(value) => [value, 'Orders']}
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #059669',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="orders" fill="#059669" name="Number of Orders" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-200">
                    <h3 className="text-lg font-semibold text-emerald-900 mb-4">Most Viewed Products</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mostViewedProducts} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis type="number" stroke="#047857" />
                                <YAxis type="category" dataKey="name" width={80} stroke="#047857" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #059669',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="views" fill="#059669" name="Views" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChartsGrid;
