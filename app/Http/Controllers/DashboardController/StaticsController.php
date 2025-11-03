<?php

namespace App\Http\Controllers\DashboardController;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

class StaticsController extends Controller
{
    public function getStatistics()
    {
        return response()->json([
            'totalUsers' => User::count(),
            'totalOrders' => Order::count(),
            'totalProducts' => Product::count(),
            'totalCategories' => Category::count(),
            'pendingOrders' => Order::where('status', 'pending')->count(),
        ]);
    }
}
