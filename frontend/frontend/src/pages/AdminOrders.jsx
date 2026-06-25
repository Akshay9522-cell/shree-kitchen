// src/pages/AdminOrders.jsx
import { Toaster, toast } from "react-hot-toast"; // Fixed missing toast import reference
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import {
  getAllOrders,
  updateOrderStatus,
} from "../services/adminService";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await getAllOrders();
      setOrders(res.data.orders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      loadOrders();
      toast.success("Order Status Updated ✅");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  // --- Premium Corporate Invoice PDF Generator ---
// --- Professional PDF Invoice Generator ---
  const downloadInvoice = (order) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    
    // Top Deep-Slate Banner
    doc.setFillColor(15, 23, 42); 
    doc.rect(0, 0, 210, 35, "F");

    // Company Branding Header
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("NEXUS ENTERPRISE", 15, 22);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("INVOICE / RECEIPT", 160, 22);

    // Section Content Meta Block Labels
    doc.setTextColor(51, 65, 85);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Billed To:", 15, 48);
    doc.text("Order Reference Details:", 130, 48);

    // Build the shipping address text cleanly from the nested object structure
    const addr = order.shippingAddress;
    const customerName = addr?.fullName || order.user?.name || "N/A";
    const formattedAddress = addr 
      ? `${addr.address || ""}\n${addr.city || ""}, ${addr.state || ""} - ${addr.pincode || ""}\nPhone: ${addr.phone || ""}`
      : "No address recorded";

    // Customer Name & Structured Address Mapping
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(customerName, 15, 54); // Bold name
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(formattedAddress, 15, 59); // Regular address details below

    // Invoice Meta Information Data Values (Right Column)
    doc.setTextColor(15, 23, 42);
    doc.text([
      `Invoice ID: #${order._id.toUpperCase()}`,
      `Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`,
      `Payment Mode: ${order.paymentMethod || "ONLINE"}`,
      `Payment Status: ${order.paymentStatus || "Paid"}`
    ], 130, 54);

    // Itemized Content Table Header Grid
    let currentY = 90; // Pushed down slightly to give multi-line addresses comfortable breathing room
    doc.setFillColor(241, 245, 249);
    doc.rect(15, currentY, 180, 8, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Product Description", 18, currentY + 5.5);
    doc.text("Qty", 145, currentY + 5.5);
    doc.text("Price", 175, currentY + 5.5);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(15, currentY + 8, 195, currentY + 8);
    currentY += 8;

    // Map through individual products securely
    doc.setFont("helvetica", "normal");
    if (order.items && order.items.length > 0) {
      order.items.forEach((item) => {
        currentY += 8;
        const productName = item.product?.name || "Marketplace Product Asset";
        const splitName = doc.splitTextToSize(productName, 115);
        
        doc.text(splitName, 18, currentY);
        doc.text(`${item.quantity}`, 145, currentY);
        doc.text(`Rs. ${item.product?.price || order.totalAmount}`, 175, currentY);
        
        doc.line(15, currentY + 3, 195, currentY + 3);
        currentY += 3;
      });
    } else {
      currentY += 8;
      doc.text("Premium Storefront Order Items", 18, currentY);
      doc.text("1", 145, currentY);
      doc.text(`Rs. ${order.totalAmount}`, 175, currentY);
      doc.line(15, currentY + 3, 195, currentY + 3);
      currentY += 3;
    }

    // Financial Calculation Total Block Footer Layout
    currentY += 15;
    doc.line(120, currentY, 195, currentY);
    
    currentY += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Grand Total:", 125, currentY);
    doc.setTextColor(22, 163, 74); 
    doc.text(`INR Rs. ${order.totalAmount}`, 165, currentY);

    // Business Legal disclaimer baseline string footer alignment data loop
    doc.setTextColor(148, 163, 184);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.text("This is a system generated corporate receipt confirmation document and requires no physical authorization stamp signatures.", 105, 275, { align: "center" });

    // Download Local Output Array Asset Stream Link Loop
    doc.save(`Invoice-${order._id.slice(-6).toUpperCase()}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-xl font-bold">Loading Orders...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Toaster position="top-center" />
      <h1 className="text-4xl font-bold mb-8">Admin Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold text-lg">Order ID</h2>
                <p className="text-gray-500 break-all">{order._id}</p>
                <p className="mt-2"><strong>Customer:</strong> {order.user?.name}</p>
                <p><strong>Email:</strong> {order.user?.email}</p>
              </div>

              <div className="text-right">
                <p className="font-bold text-xl text-green-600">₹{order.totalAmount}</p>
                <p className="mt-2">
                  Payment:
                  <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 rounded">
                    {order.paymentStatus}
                  </span>
                </p>
              </div>
            </div>

            <hr className="my-4" />

            <div>
              <h3 className="font-bold mb-2">Products</h3>
              {order.items.map((item) => (
                <div key={item._id} className="flex justify-between py-2">
                  <span>{item.product?.name}</span>
                  <span>Qty: {item.quantity}</span>
                </div>
              ))}
            </div>

            <hr className="my-4" />

            {/* ACTION FOOTER ZONE */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p><strong>Current Status:</strong> {order.orderStatus}</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
                {/* Brand New Download Action Hook Button */}
                <button
                  onClick={() => downloadInvoice(order)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-4 py-2 rounded shadow transition text-sm cursor-pointer inline-flex items-center gap-2"
                >
                  📥 Download Invoice
                </button>

                <select
                  value={order.orderStatus}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="border p-2 rounded text-sm bg-white cursor-pointer outline-none"
                >
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Packed</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}