import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Download,
    Calendar,
    Eye,
    ShoppingCart,
    BarChart3,
    FileText,
    RefreshCw,
    DollarSign,
    Users,
    TrendingUp
} from "lucide-react";
import useToast from "../../UserInterFaceComponents/Common/useToast.jsx";

const Reports = () => {
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 30))
            .toISOString()
            .split("T")[0],
        end: new Date().toISOString().split("T")[0],
    });
    const [activeTab, setActiveTab] = useState("overview");
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({});
    const { success, error: showError } = useToast();

    // Fetch data when component mounts or filters change
    useEffect(() => {
        if (activeTab === "orders" || activeTab === "overview") {
            fetchOrders();
            fetchStats();
        }
    }, [dateRange, statusFilter, activeTab]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                start_date: dateRange.start,
                end_date: dateRange.end,
                ...(statusFilter !== 'all' && { status: statusFilter })
            });

            const response = await axios.get(`http://127.0.0.1:8000/api/reports/orders?${params}`);
            if (response.data.success) {
                setOrders(response.data.orders || []);
            } else {
                showError(response.data.message || "Failed to load orders");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            showError("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const params = new URLSearchParams({
                start_date: dateRange.start,
                end_date: dateRange.end
            });

            const response = await axios.get(`http://127.0.0.1:8000/api/reports/stats?${params}`);
            if (response.data.success) {
                setStats(response.data.stats || {});
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
            showError("Failed to load statistics");
        }
    };

    const exportOrders = async () => {
        try {
            const params = new URLSearchParams({
                start_date: dateRange.start,
                end_date: dateRange.end,
                format: 'excel',
                ...(statusFilter !== 'all' && { status: statusFilter })
            });

            const response = await axios.get(`http://127.0.0.1:8000/api/reports/export/orders?${params}`);

            if (response.data.success) {
                success('Orders export prepared successfully!');
                // For now, we'll show a success message since Excel export needs additional setup
                console.log('Export data:', response.data);
            }
        } catch (error) {
            console.error("Error exporting orders:", error);
            showError("Failed to export orders");
        }
    };

    const handleRefresh = () => {
        fetchOrders();
        fetchStats();
    };

    const quickDateRanges = {
        Today: {
            start: new Date().toISOString().split("T")[0],
            end: new Date().toISOString().split("T")[0],
        },
        "Last 7 Days": {
            start: new Date(new Date().setDate(new Date().getDate() - 7))
                .toISOString()
                .split("T")[0],
            end: new Date().toISOString().split("T")[0],
        },
        "Last 30 Days": {
            start: new Date(new Date().setDate(new Date().getDate() - 30))
                .toISOString()
                .split("T")[0],
            end: new Date().toISOString().split("T")[0],
        },
        "This Month": {
            start: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                .toISOString()
                .split("T")[0],
            end: new Date().toISOString().split("T")[0],
        },
    };

    const handleQuickDateRange = (range) => {
        setDateRange(quickDateRanges[range]);
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'contacted': 'bg-blue-100 text-blue-800',
            'completed': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const StatCard = ({ title, value, icon: Icon, description, color = "blue" }) => (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {description && (
                        <p className="text-sm text-gray-500 mt-1">{description}</p>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${
                    color === 'blue' ? 'bg-blue-50' :
                        color === 'green' ? 'bg-green-50' :
                            color === 'yellow' ? 'bg-yellow-50' :
                                color === 'red' ? 'bg-red-50' : 'bg-gray-50'
                }`}>
                    <Icon className={`w-6 h-6 ${
                        color === 'blue' ? 'text-blue-600' :
                            color === 'green' ? 'text-green-600' :
                                color === 'yellow' ? 'text-yellow-600' :
                                    color === 'red' ? 'text-red-600' : 'text-gray-600'
                    }`} />
                </div>
            </div>
        </div>
    );

    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Reports & Analytics
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Comprehensive insights into your ecommerce performance
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleRefresh}
                                disabled={loading}
                                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                {loading ? 'Loading...' : 'Refresh'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Report Filters</h3>
                            <p className="text-gray-600 text-sm">Filter data by date range and status</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center gap-2">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {Object.keys(quickDateRanges).map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => handleQuickDateRange(range)}
                                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <input
                                        type="date"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                                <span className="text-gray-400">to</span>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <input
                                        type="date"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: "overview", label: "Overview", icon: BarChart3 },
                                { id: "orders", label: "Orders", icon: ShoppingCart },
                                { id: "quotations", label: "Quotations", icon: FileText },
                                { id: "product-views", label: "Product Views", icon: Eye },
                            ].map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === tab.id
                                                ? "border-blue-500 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {activeTab === "overview" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Orders"
                                value={stats.total_orders || 0}
                                icon={ShoppingCart}
                                description={`${dateRange.start} to ${dateRange.end}`}
                                color="blue"
                            />
                            <StatCard
                                title="Pending Orders"
                                value={stats.pending_orders || 0}
                                icon={ShoppingCart}
                                description="Awaiting action"
                                color="yellow"
                            />
                            <StatCard
                                title="Completed Orders"
                                value={stats.completed_orders || 0}
                                icon={ShoppingCart}
                                description="Successfully delivered"
                                color="green"
                            />
                            <StatCard
                                title="Total Revenue"
                                value={`Rs. ${stats.total_revenue ? stats.total_revenue.toLocaleString() : '0'}`}
                                icon={DollarSign}
                                description="From completed orders"
                                color="green"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Order Analytics
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Average Order Value:</span>
                                        <span className="font-semibold">Rs. {stats.average_order_value ? stats.average_order_value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Completion Rate:</span>
                                        <span className="font-semibold text-green-600">
                                            {stats.completion_rate ? stats.completion_rate.toFixed(1) : 0}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Contacted Orders:</span>
                                        <span className="font-semibold">{stats.contacted_orders || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Cancelled Orders:</span>
                                        <span className="font-semibold text-red-600">{stats.cancelled_orders || 0}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Quick Summary
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Date Range:</span>
                                        <span className="font-medium">{dateRange.start} to {dateRange.end}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Status Filter:</span>
                                        <span className="font-medium capitalize">{statusFilter}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Total Records:</span>
                                        <span className="font-medium">{orders.length} orders</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Last Updated:</span>
                                        <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    onClick={exportOrders}
                                    className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Download className="w-5 h-5 text-green-600" />
                                    <span>Export Orders (Excel)</span>
                                </button>
                                <button className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors opacity-50 cursor-not-allowed">
                                    <Download className="w-5 h-5 text-red-600" />
                                    <span>Export Quotations (PDF)</span>
                                </button>
                                <button className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors opacity-50 cursor-not-allowed">
                                    <Download className="w-5 h-5 text-blue-600" />
                                    <span>Export Product Views (Excel)</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === "orders" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Order Reports</h3>
                                <p className="text-gray-600 text-sm">
                                    Showing {orders.length} orders from {dateRange.start} to {dateRange.end}
                                    {statusFilter !== 'all' && ` (Filtered by: ${statusFilter})`}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={exportOrders}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Export Excel
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-3 text-gray-600">Loading orders...</span>
                            </div>
                        ) : orders.length > 0 ? (
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Contact
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Items
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {order.order_code}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {order.customer_name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {order.customer_email}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order.customer_phone || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                    <div className="text-xs text-gray-400">
                                                        {new Date(order.created_at).toLocaleTimeString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    Rs. {parseFloat(order.total_amount || 0).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order.items_count || 1} item(s)
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                        {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                                <p className="text-gray-500 mb-4">
                                    {statusFilter !== 'all'
                                        ? `No ${statusFilter} orders found in the selected date range.`
                                        : 'No orders found in the selected date range.'
                                    }
                                </p>
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "product-views" && (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <Eye className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-600 mb-3">Product View Analytics</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                            Product view tracking will be available once the analytics system is implemented.
                        </p>
                        <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                            Coming Soon
                        </div>
                    </div>
                )}

                {activeTab === "quotations" && (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                        <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-600 mb-3">Quotation Reports</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                            Quotation tracking and analytics will be available once the quotation system is implemented.
                        </p>
                        <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                            Coming Soon
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
