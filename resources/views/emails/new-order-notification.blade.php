<!DOCTYPE html>
<html>
<head>
    <title>New Order Received</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; }
        .order-details { background: #fff; padding: 20px; margin: 20px 0; border: 1px solid #ddd; }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .total { font-weight: bold; font-size: 1.2em; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>New Order Received!</h1>
        <p>Order #: {{ $order->order_code }}</p>
    </div>

    <div class="order-details">
        <h2>Order Information</h2>
        <p><strong>Order Code:</strong> {{ $order->order_code }}</p>
        <p><strong>Total Amount:</strong> Rs:{{ number_format($order->total_amount, 2) }}</p>
        <p><strong>Delivery Fee:</strong> Rs:{{ number_format($order->delivery_fee, 2) }}</p>
        <p><strong>Delivery Option:</strong> {{ $order->delivery_option }}</p>
        <p><strong>Order Date:</strong> {{ $order->created_at->format('F j, Y g:i A') }}</p>
        <p><strong>Status:</strong> <span style="color: #007bff;">{{ ucfirst($order->status) }}</span></p>
    </div>

    <div class="order-details">
        <h2>Order Items</h2>
        <table class="table">
            <thead>
            <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
            </tr>
            </thead>
            <tbody>
            @foreach($orderItems as $item)
                <tr>
                    <td>{{ $item->product->name ?? 'Product' }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>Rs:{{ number_format($item->price, 2) }}</td>
                    <td>Rs:{{ number_format($item->quantity * $item->price, 2) }}</td>
                </tr>
            @endforeach
            </tbody>
        </table>

        <div style="text-align: right; margin-top: 20px;">
            <p class="total">Total: Rs:{{ number_format($order->total_amount, 2) }}</p>
        </div>
    </div>

    <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f9fa;">
        <p>Please log in to your admin panel to process this order.</p>
        <p><a href="{{ url('/admin/orders') }}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Order in Admin</a></p>
    </div>
</div>
</body>
</html>
