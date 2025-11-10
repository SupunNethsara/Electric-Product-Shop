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
    TrendingUp,
    Star,
    ArrowUp,
    ExternalLink
} from "lucide-react";

import 'jspdf-autotable';
import useToast from "../../../UserInterFaceComponents/Common/useToast.jsx";

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
    const [mostViewedProducts, setMostViewedProducts] = useState([]);

    const [productsLoading, setProductsLoading] = useState(false);
    const { success, error: showError } = useToast();

    useEffect(() => {
        if (activeTab === "orders" || activeTab === "overview") {
            fetchOrders();
            fetchStats();
        }
        if (activeTab === "overview" || activeTab === "product-views") {
            fetchMostViewedProducts();
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

    const fetchMostViewedProducts = async () => {
        setProductsLoading(true);
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/products/most-viewed");
            if (response.data.success) {
                const products = response.data.products !== undefined
                    ? response.data.products
                    : (response.data.product ? [response.data.product] : []);

                setMostViewedProducts(products);
            } else {
                showError(response.data.message || "Failed to load most viewed products");
                setMostViewedProducts([]);
            }
        } catch (error) {
            console.error("Error fetching most viewed products:", error);
            showError("Failed to load most viewed products");
            setMostViewedProducts([]);
        } finally {
            setProductsLoading(false);
        }
    };

    const exportOrdersPDF = async () => {
        try {
            setLoading(true);

            const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
            const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

            const pdfData = {
                title: 'Order Report',
                dateRange: `${dateRange.start} to ${dateRange.end}`,
                filters: statusFilter !== 'all' ? `Status: ${statusFilter}` : 'All Status',
                totalOrders: orders.length,
                totalRevenue: totalRevenue,
                averageOrderValue: averageOrderValue,
                orders: orders.map(order => ({
                    orderCode: order.order_code,
                    customerName: order.customer_name,
                    customerEmail: order.customer_email,
                    customerPhone: order.customer_phone || 'N/A',
                    date: new Date(order.created_at).toLocaleDateString(),
                    time: new Date(order.created_at).toLocaleTimeString(),
                    amount: `Rs. ${parseFloat(order.total_amount || 0).toLocaleString()}`,
                    items: order.items_count || 1,
                    status: order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'
                }))
            };

            const { jsPDF } = await import('jspdf');
            const autoTable = (await import('jspdf-autotable')).default;
            const doc = new jsPDF();

            doc.setFontSize(20);
            doc.setTextColor(40, 40, 40);
            doc.text('ORDER REPORT', 105, 15, { align: 'center' });

            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Date Range: ${pdfData.dateRange}`, 105, 22, { align: 'center' });
            doc.text(`Filters: ${pdfData.filters}`, 105, 27, { align: 'center' });
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 32, { align: 'center' });

            doc.setFontSize(12);
            doc.setTextColor(40, 40, 40);
            doc.text('SUMMARY', 14, 45);

            doc.setFontSize(10);
            doc.text(`Total Orders: ${pdfData.totalOrders}`, 14, 55);
            doc.text(`Total Revenue: Rs. ${pdfData.totalRevenue.toLocaleString()}`, 14, 60);
            doc.text(`Average Order Value: Rs. ${pdfData.averageOrderValue.toFixed(2)}`, 14, 65);

            const tableHeaders = [
                ['Order Code', 'Customer', 'Contact', 'Date', 'Amount', 'Items', 'Status']
            ];

            const tableData = pdfData.orders.map(order => [
                order.orderCode,
                order.customerName,
                order.customerPhone,
                order.date,
                order.amount,
                order.items.toString(),
                order.status
            ]);

            autoTable(doc, {
                startY: 75,
                head: tableHeaders,
                body: tableData,
                theme: 'grid',
                styles: {
                    fontSize: 8,
                    cellPadding: 2,
                },
                headStyles: {
                    fillColor: [59, 130, 246],
                    textColor: 255,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                },
                columnStyles: {
                    0: { cellWidth: 25 },
                    1: { cellWidth: 25 },
                    2: { cellWidth: 20 },
                    3: { cellWidth: 20 },
                    4: { cellWidth: 20 },
                    5: { cellWidth: 15 },
                    6: { cellWidth: 20 }
                },
                margin: { top: 75 }
            });

            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.text(`Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
                doc.text(`Generated by Ecommerce System`, 105, doc.internal.pageSize.height - 5, { align: 'center' });
            }

            const fileName = `order-report-${dateRange.start}-to-${dateRange.end}.pdf`;
            doc.save(fileName);

            success('PDF report downloaded successfully!');

        } catch (error) {
            console.error('Error generating PDF:', error);
            showError('Failed to generate PDF report');
        } finally {
            setLoading(false);
        }
    };

    const exportOrdersExcel = async () => {
        try {
            setLoading(true);

            const headers = ['Order Code', 'Customer Name', 'Email', 'Phone', 'Date', 'Time', 'Amount', 'Items', 'Status'];
            const csvContent = [
                headers.join(','),
                ...orders.map(order => [
                    order.order_code,
                    `"${order.customer_name}"`,
                    order.customer_email,
                    order.customer_phone || 'N/A',
                    new Date(order.created_at).toLocaleDateString(),
                    new Date(order.created_at).toLocaleTimeString(),
                    parseFloat(order.total_amount || 0),
                    order.items_count || 1,
                    order.status
                ].join(','))
            ].join('\n');

            // Create and download CSV file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `order-report-${dateRange.start}-to-${dateRange.end}.csv`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            success('Excel report downloaded successfully!');

        } catch (error) {
            console.error('Error generating Excel:', error);
            showError('Failed to generate Excel report');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchOrders();
        fetchStats();
        if (activeTab === "overview" || activeTab === "product-views") {
            fetchMostViewedProducts();
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

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'contacted': 'bg-blue-100 text-blue-800',
            'completed': 'bg-green-100 text-green-800',
            'cancelled': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const StatCard = ({ title, value, icon: Icon, description, color = "blue", trend }) => (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                        {trend && (
                            <span className={`flex items-center text-xs font-medium ${
                                trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
                            }`}>
                                <ArrowUp className={`w-3 h-3 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
                                {Math.abs(trend)}%
                            </span>
                        )}
                    </div>
                    {description && (
                        <p className="text-sm text-gray-500 mt-2">{description}</p>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${
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

    const ProductCard = ({ product, rank }) => {
        const images = product.images ? JSON.parse(product.images) : [];
        const mainImage = images[0] || product.image;

        return (
            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200 group">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            rank === 1 ? 'bg-yellow-500' :
                                rank === 2 ? 'bg-gray-400' :
                                    rank === 3 ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                            {rank}
                        </div>
                    </div>

                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden">
                            {mainImage ? (
                                <img
                                    src={mainImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <ShoppingCart className="w-6 h-6" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {product.name}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                    {product.category?.name}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="flex items-center gap-1">
                                        <Eye className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs font-medium text-gray-700">
                                            {product.total_views?.toLocaleString()} views
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 text-yellow-400" />
                                        <span className="text-xs text-gray-600">
                                            {product.average_rating || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-gray-100 rounded">
                                <ExternalLink className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm font-bold text-green-600">
                                    Rs. {parseFloat(product.price).toLocaleString()}
                                </span>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                product.availability > 10 ? 'bg-green-100 text-green-800' :
                                    product.availability > 0 ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                            }`}>
                                {product.availability > 0 ? `${product.availability} in stock` : 'Out of stock'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const TrendingProductsSection = () => (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Most Viewed Products
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                        Top performing products by view count
                    </p>
                </div>
                <button
                    onClick={fetchMostViewedProducts}
                    disabled={productsLoading}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${productsLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {productsLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-200 rounded-xl p-4 h-24"></div>
                        </div>
                    ))}
                </div>
            ) : mostViewedProducts.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                    {mostViewedProducts.slice(0, 6).map((product, index) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            rank={index + 1}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <Eye className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <h4 className="text-gray-500 font-medium">No product views data available</h4>
                    <p className="text-gray-400 text-sm mt-1">
                        Product views will appear here once customers start browsing
                    </p>
                </div>
            )}

            {mostViewedProducts.length > 6 && (
                <div className="mt-6 text-center">
                    <button className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View All Products
                    </button>
                </div>
            )}
        </div>
    );

    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

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
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <span className="text-gray-400">to</span>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <input
                                        type="date"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                        className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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
                                trend={12.5}
                            />
                            <StatCard
                                title="Pending Orders"
                                value={stats.pending_orders || 0}
                                icon={ShoppingCart}
                                description="Awaiting action"
                                color="yellow"
                                trend={-2.3}
                            />
                            <StatCard
                                title="Completed Orders"
                                value={stats.completed_orders || 0}
                                icon={ShoppingCart}
                                description="Successfully delivered"
                                color="green"
                                trend={8.7}
                            />
                            <StatCard
                                title="Total Revenue"
                                value={`Rs. ${stats.total_revenue ? stats.total_revenue.toLocaleString() : '0'}`}
                                icon={DollarSign}
                                description="From completed orders"
                                color="green"
                                trend={15.2}
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
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
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <button
                                            onClick={exportOrdersPDF}
                                            disabled={loading || orders.length === 0}
                                            className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Download className="w-5 h-5 text-green-600" />
                                            <span>Export Orders (PDF)</span>
                                        </button>
                                        <button
                                            className="flex items-center justify-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled
                                        >
                                            <Download className="w-5 h-5 text-red-600" />
                                            <span>Export Quotations (PDF)</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-1">
                                <TrendingProductsSection />
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
                                    onClick={exportOrdersExcel}
                                    disabled={loading || orders.length === 0}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Product View Analytics</h3>
                                <p className="text-gray-600 text-sm">
                                    Track product performance and customer engagement
                                </p>
                            </div>
                            <button
                                onClick={fetchMostViewedProducts}
                                disabled={productsLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${productsLoading ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                        </div>

                        <TrendingProductsSection />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                title="Total Product Views"
                                value={mostViewedProducts.reduce((sum, product) => sum + (product.total_views || 0), 0).toLocaleString()}
                                icon={Eye}
                                description="Across all products"
                                color="blue"
                            />
                            <StatCard
                                title="Average Views"
                                value={mostViewedProducts.length > 0 ?
                                    Math.round(mostViewedProducts.reduce((sum, product) => sum + (product.total_views || 0), 0) / mostViewedProducts.length).toLocaleString() :
                                    '0'
                                }
                                icon={TrendingUp}
                                description="Per product"
                                color="green"
                            />
                            <StatCard
                                title="Top Product Views"
                                value={mostViewedProducts.length > 0 ? mostViewedProducts[0]?.total_views?.toLocaleString() || '0' : '0'}
                                icon={Star}
                                description="Most viewed product"
                                color="yellow"
                            />
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
