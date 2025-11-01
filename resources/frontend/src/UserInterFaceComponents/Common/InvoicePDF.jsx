import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const InvoicePDF = {
    generate: async (orderData) => {
        const { order, user, orderSummary, items, deliveryOption } = orderData;

        try {
            // Create a simple HTML structure for the PDF to avoid oklch colors
            const pdfContent = `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
                    <!-- Header -->
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
                        <div>
                            <h1 style="font-size: 28px; font-weight: bold; color: #000; margin: 0 0 10px 0;">INVOICE</h1>
                            <p style="color: #666; margin: 5px 0;"><strong>Order #:</strong> ${order.order_number || order.id}</p>
                            <p style="color: #666; margin: 5px 0;"><strong>Date:</strong> ${InvoicePDF.formatDate(order.created_at)}</p>
                        </div>
                        <div style="text-align: right;">
                            <h2 style="font-size: 18px; font-weight: bold; color: #000; margin: 0 0 10px 0;">Your Store</h2>
                            <p style="color: #666; margin: 5px 0;">123 Business Street</p>
                            <p style="color: #666; margin: 5px 0;">City, State 12345</p>
                            <p style="color: #666; margin: 5px 0;">contact@yourstore.com</p>
                        </div>
                    </div>

                    <!-- Bill To Section -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px;">
                        <div>
                            <h3 style="font-size: 16px; font-weight: bold; color: #000; margin-bottom: 10px;">Bill To:</h3>
                            <p style="color: #333; margin: 5px 0;">${user.name}</p>
                            <p style="color: #333; margin: 5px 0;">${user.email}</p>
                            <p style="color: #333; margin: 5px 0;">${user.profile?.phone || "N/A"}</p>
                            <p style="color: #333; margin: 5px 0;">
                                ${user.profile?.address || "Address not provided"}
                                ${user.profile?.city ? `, ${user.profile.city}` : ""}
                                ${user.profile?.postal_code ? `, ${user.profile.postal_code}` : ""}
                                ${user.profile?.country ? `, ${user.profile.country}` : ""}
                            </p>
                        </div>
                        <div>
                            <h3 style="font-size: 16px; font-weight: bold; color: #000; margin-bottom: 10px;">Order Details:</h3>
                            <p style="color: #333; margin: 5px 0;"><strong>Order Date:</strong> ${InvoicePDF.formatDate(order.created_at)}</p>
                            <p style="color: #333; margin: 5px 0;"><strong>Delivery:</strong> ${deliveryOption?.name || "Standard Delivery"}</p>
                            <p style="color: #333; margin: 5px 0;"><strong>Status:</strong> Confirmed</p>
                        </div>
                    </div>

                    <!-- Items Table -->
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #ccc;">
                        <thead>
                            <tr style="background-color: #f5f5f5;">
                                <th style="border: 1px solid #ccc; padding: 12px; text-align: left; font-weight: bold;">Item</th>
                                <th style="border: 1px solid #ccc; padding: 12px; text-align: center; font-weight: bold;">Quantity</th>
                                <th style="border: 1px solid #ccc; padding: 12px; text-align: right; font-weight: bold;">Unit Price</th>
                                <th style="border: 1px solid #ccc; padding: 12px; text-align: right; font-weight: bold;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map((item, index) => `
                                <tr>
                                    <td style="border: 1px solid #ccc; padding: 12px;">${item.product?.name || "Product"}</td>
                                    <td style="border: 1px solid #ccc; padding: 12px; text-align: center;">${item.quantity}</td>
                                    <td style="border: 1px solid #ccc; padding: 12px; text-align: right;">Rs. ${item.product?.price ? parseFloat(item.product.price).toFixed(2) : "0.00"}</td>
                                    <td style="border: 1px solid #ccc; padding: 12px; text-align: right;">Rs. ${(parseFloat(item.product?.price || 0) * item.quantity).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <!-- Summary -->
                    <div style="display: flex; justify-content: flex-end;">
                        <div style="width: 250px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="color: #333;">Subtotal:</span>
                                <span style="color: #000;">Rs. ${orderSummary.itemsTotal.toFixed(2)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="color: #333;">Delivery Fee:</span>
                                <span style="color: #000;">Rs. ${orderSummary.deliveryFee.toFixed(2)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="color: #333;">Tax:</span>
                                <span style="color: #000;">Rs. 0.00</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span style="color: #333;">Discount:</span>
                                <span style="color: #ff0000;">-Rs. 0.00</span>
                            </div>
                            <div style="border-top: 1px solid #ccc; padding-top: 8px; margin-top: 8px;">
                                <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
                                    <span>Total:</span>
                                    <span>Rs. ${orderSummary.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; color: #666;">
                        <p>Thank you for your business!</p>
                        <p style="font-size: 12px; margin-top: 8px;">
                            If you have any questions about this invoice, please contact support@yourstore.com
                        </p>
                    </div>
                </div>
            `;

            // Create a temporary container for PDF generation
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '0';
            tempContainer.style.width = '800px';
            tempContainer.style.backgroundColor = 'white';
            tempContainer.style.padding = '20px';
            tempContainer.innerHTML = pdfContent;
            document.body.appendChild(tempContainer);

            const canvas = await html2canvas(tempContainer, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            // Clean up
            document.body.removeChild(tempContainer);

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`invoice-${order.order_number || order.id}.pdf`);

            return true;

        } catch (error) {
            console.error('Error generating PDF:', error);
            throw new Error('Failed to generate PDF invoice');
        }
    },

    formatDate: (dateString) => {
        const date = dateString ? new Date(dateString) : new Date();
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    },

    // Method to generate invoice for email or other purposes
    generateInvoiceHTML: (orderData) => {
        const { order, user, orderSummary, items, deliveryOption } = orderData;

        return `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; background: white;">
                <!-- Header -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
                    <div>
                        <h1 style="font-size: 28px; font-weight: bold; color: #000; margin: 0 0 10px 0;">INVOICE</h1>
                        <p style="color: #666; margin: 5px 0;"><strong>Order #:</strong> ${order.order_number || order.id}</p>
                        <p style="color: #666; margin: 5px 0;"><strong>Date:</strong> ${InvoicePDF.formatDate(order.created_at)}</p>
                    </div>
                    <div style="text-align: right;">
                        <h2 style="font-size: 18px; font-weight: bold; color: #000; margin: 0 0 10px 0;">Your Store</h2>
                        <p style="color: #666; margin: 5px 0;">123 Business Street</p>
                        <p style="color: #666; margin: 5px 0;">City, State 12345</p>
                        <p style="color: #666; margin: 5px 0;">contact@yourstore.com</p>
                    </div>
                </div>

                <!-- Bill To Section -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px;">
                    <div>
                        <h3 style="font-size: 16px; font-weight: bold; color: #000; margin-bottom: 10px;">Bill To:</h3>
                        <p style="color: #333; margin: 5px 0;">${user.name}</p>
                        <p style="color: #333; margin: 5px 0;">${user.email}</p>
                        <p style="color: #333; margin: 5px 0;">${user.profile?.phone || "N/A"}</p>
                        <p style="color: #333; margin: 5px 0;">
                            ${user.profile?.address || "Address not provided"}
                            ${user.profile?.city ? `, ${user.profile.city}` : ""}
                            ${user.profile?.postal_code ? `, ${user.profile.postal_code}` : ""}
                            ${user.profile?.country ? `, ${user.profile.country}` : ""}
                        </p>
                    </div>
                    <div>
                        <h3 style="font-size: 16px; font-weight: bold; color: #000; margin-bottom: 10px;">Order Details:</h3>
                        <p style="color: #333; margin: 5px 0;"><strong>Order Date:</strong> ${InvoicePDF.formatDate(order.created_at)}</p>
                        <p style="color: #333; margin: 5px 0;"><strong>Delivery:</strong> ${deliveryOption?.name || "Standard Delivery"}</p>
                        <p style="color: #333; margin: 5px 0;"><strong>Status:</strong> Confirmed</p>
                    </div>
                </div>

                <!-- Items Table -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #ccc;">
                    <thead>
                        <tr style="background-color: #f5f5f5;">
                            <th style="border: 1px solid #ccc; padding: 12px; text-align: left; font-weight: bold;">Item</th>
                            <th style="border: 1px solid #ccc; padding: 12px; text-align: center; font-weight: bold;">Quantity</th>
                            <th style="border: 1px solid #ccc; padding: 12px; text-align: right; font-weight: bold;">Unit Price</th>
                            <th style="border: 1px solid #ccc; padding: 12px; text-align: right; font-weight: bold;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map((item, index) => `
                            <tr>
                                <td style="border: 1px solid #ccc; padding: 12px;">${item.product?.name || "Product"}</td>
                                <td style="border: 1px solid #ccc; padding: 12px; text-align: center;">${item.quantity}</td>
                                <td style="border: 1px solid #ccc; padding: 12px; text-align: right;">Rs. ${item.product?.price ? parseFloat(item.product.price).toFixed(2) : "0.00"}</td>
                                <td style="border: 1px solid #ccc; padding: 12px; text-align: right;">Rs. ${(parseFloat(item.product?.price || 0) * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <!-- Summary -->
                <div style="display: flex; justify-content: flex-end;">
                    <div style="width: 250px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="color: #333;">Subtotal:</span>
                            <span style="color: #000;">Rs. ${orderSummary.itemsTotal.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="color: #333;">Delivery Fee:</span>
                            <span style="color: #000;">Rs. ${orderSummary.deliveryFee.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="color: #333;">Tax:</span>
                            <span style="color: #000;">Rs. 0.00</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="color: #333;">Discount:</span>
                            <span style="color: #ff0000;">-Rs. 0.00</span>
                        </div>
                        <div style="border-top: 1px solid #ccc; padding-top: 8px; margin-top: 8px;">
                            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
                                <span>Total:</span>
                                <span>Rs. ${orderSummary.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; color: #666;">
                    <p>Thank you for your business!</p>
                    <p style="font-size: 12px; margin-top: 8px;">
                        If you have any questions about this invoice, please contact support@yourstore.com
                    </p>
                </div>
            </div>
        `;
    }
};

export default InvoicePDF;
