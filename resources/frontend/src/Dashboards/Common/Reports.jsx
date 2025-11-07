import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Download,
    Filter,
    Calendar,
    Eye,
    ShoppingCart,
    Users,
    TrendingUp,
    BarChart3,
    FileText,
    RefreshCw,
    Search,
} from "lucide-react";
import useToast from "../../UserInterFaceComponents/Common/useToast.jsx";

const Reports = () => {
    const [loading, setLoading] = useState(false);
    const [reports, setReports] = useState({
        orders: [],
        productViews: [],
        quotations: [],
    });
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setDate(new Date().getDate() - 30))
            .toISOString()
            .split("T")[0],
        end: new Date().toISOString().split("T")[0],
    });
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalQuotations: 0,
        convertedQuotations: 0,
        totalProductViews: 0,
        mostViewedProduct: null,
    });
    const [activeTab, setActiveTab] = useState("overview");
    const { success, error: showError } = useToast();

    useEffect(() => {
        fetchReports();
        fetchStats();
    }, [dateRange]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                start_date: dateRange.start,
                end_date: dateRange.end,
            });

            const response = await axios.get(
                `http://127.0.0.1:8000/api/reports?${params}`,
            );
            setReports(response.data);
        } catch (error) {
            console.error("Error fetching reports:", error);
            showError("Failed to load reports");
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const params = new URLSearchParams({
                start_date: dateRange.start,
                end_date: dateRange.end,
            });

            const response = await axios.get(
                `http://127.0.0.1:8000/api/reports/stats?${params}`,
            );
            setStats(response.data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const exportReport = async (type, format) => {
        try {
            const params = new URLSearchParams({
                start_date: dateRange.start,
                end_date: dateRange.end,
                format: format,
            });

            const response = await axios.get(
                `http://127.0.0.1:8000/api/reports/export/${type}?${params}`,
                {
                    responseType: "blob",
                },
            );

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `${type}_report_${dateRange.start}_to_${dateRange.end}.${format}`,
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            success(
                `${type.charAt(0).toUpperCase() + type.slice(1)} report exported successfully!`,
            );
        } catch (error) {
            console.error("Error exporting report:", error);
            showError("Failed to export report");
        }
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

    const StatCard = ({
        title,
        value,
        icon: Icon,
        change,
        changeType = "neutral",
    }) => (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {value}
                    </p>
                    {change && (
                        <p
                            className={`text-sm mt-1 ${
                                changeType === "positive"
                                    ? "text-green-600"
                                    : changeType === "negative"
                                      ? "text-red-600"
                                      : "text-gray-600"
                            }`}
                        >
                            {change}
                        </p>
                    )}
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Reports & Analytics
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Comprehensive insights into your ecommerce
                                performance
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={fetchReports}
                                disabled={loading}
                                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                <RefreshCw
                                    className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                                />
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Date Range
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Select the period for your reports
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Quick Date Range Buttons */}
                            <div className="flex flex-wrap gap-2">
                                {Object.keys(quickDateRanges).map((range) => (
                                    <button
                                        key={range}
                                        onClick={() =>
                                            handleQuickDateRange(range)
                                        }
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
                                        onChange={(e) =>
                                            setDateRange((prev) => ({
                                                ...prev,
                                                start: e.target.value,
                                            }))
                                        }
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                                <span className="text-gray-400">to</span>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <input
                                        type="date"
                                        value={dateRange.end}
                                        onChange={(e) =>
                                            setDateRange((prev) => ({
                                                ...prev,
                                                end: e.target.value,
                                            }))
                                        }
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
                                {
                                    id: "overview",
                                    label: "Overview",
                                    icon: BarChart3,
                                },
                                {
                                    id: "orders",
                                    label: "Orders",
                                    icon: ShoppingCart,
                                },
                                {
                                    id: "quotations",
                                    label: "Quotations",
                                    icon: FileText,
                                },
                                {
                                    id: "product-views",
                                    label: "Product Views",
                                    icon: Eye,
                                },
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
                                value={stats.totalOrders}
                                icon={ShoppingCart}
                                change="+12% from last period"
                                changeType="positive"
                            />
                            <StatCard
                                title="Pending Orders"
                                value={stats.pendingOrders}
                                icon={ShoppingCart}
                                change="5 need attention"
                                changeType="negative"
                            />
                            <StatCard
                                title="Total Quotations"
                                value={stats.totalQuotations}
                                icon={FileText}
                                change="+8% from last period"
                                changeType="positive"
                            />
                            <StatCard
                                title="Product Views"
                                value={stats.totalProductViews}
                                icon={Eye}
                                change="+15% from last period"
                                changeType="positive"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Quotation Conversion
                                </h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.convertedQuotations} /{" "}
                                            {stats.totalQuotations}
                                        </p>
                                        <p className="text-gray-600">
                                            Quotations converted to orders
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-green-600">
                                            {stats.totalQuotations > 0
                                                ? Math.round(
                                                      (stats.convertedQuotations /
                                                          stats.totalQuotations) *
                                                          100,
                                                  )
                                                : 0}
                                            %
                                        </p>
                                        <p className="text-gray-600">
                                            Conversion rate
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {stats.mostViewedProduct && (
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Most Viewed Product
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={
                                                stats.mostViewedProduct.image ||
                                                "/placeholder-image.jpg"
                                            }
                                            alt={stats.mostViewedProduct.name}
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">
                                                {stats.mostViewedProduct.name}
                                            </h4>
                                            <p className="text-gray-600 text-sm">
                                                {
                                                    stats.mostViewedProduct
                                                        .item_code
                                                }
                                            </p>
                                            <p className="text-blue-600 font-semibold">
                                                {
                                                    stats.mostViewedProduct
                                                        .view_count
                                                }{" "}
                                                views
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Export Reports
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    onClick={() =>
                                        exportReport("orders", "excel")
                                    }
                                    className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Download className="w-5 h-5 text-green-600" />
                                    <span>Export Orders (Excel)</span>
                                </button>
                                <button
                                    onClick={() =>
                                        exportReport("quotations", "pdf")
                                    }
                                    className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Download className="w-5 h-5 text-red-600" />
                                    <span>Export Quotations (PDF)</span>
                                </button>
                                <button
                                    onClick={() =>
                                        exportReport("product-views", "excel")
                                    }
                                    className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
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
                            <h3 className="text-lg font-semibold text-gray-900">
                                Order Reports
                            </h3>
                            <button
                                onClick={() => exportReport("orders", "excel")}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Export Excel
                            </button>
                        </div>

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
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {reports.orders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    #{order.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {order.customer_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(
                                                        order.created_at,
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    Rs. {order.total_amount}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            order.status ===
                                                            "completed"
                                                                ? "bg-green-100 text-green-800"
                                                                : order.status ===
                                                                    "pending"
                                                                  ? "bg-yellow-100 text-yellow-800"
                                                                  : order.status ===
                                                                      "cancelled"
                                                                    ? "bg-red-100 text-red-800"
                                                                    : "bg-blue-100 text-blue-800"
                                                        }`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "product-views" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Product View Analytics
                            </h3>
                            <button
                                onClick={() =>
                                    exportReport("product-views", "excel")
                                }
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                Export Excel
                            </button>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Item Code
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Views
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Last Viewed
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {reports.productViews.map((product) => (
                                            <tr
                                                key={product.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={
                                                                product.image ||
                                                                "/placeholder-image.jpg"
                                                            }
                                                            alt={product.name}
                                                            className="w-10 h-10 object-cover rounded-lg border border-gray-200"
                                                        />
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {product.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {product.model}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {product.item_code}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <span className="font-semibold">
                                                        {product.view_count}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {product.last_viewed
                                                        ? new Date(
                                                              product.last_viewed,
                                                          ).toLocaleDateString()
                                                        : "Never"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;
