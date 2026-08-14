import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

export const downloadReceiptPDF = (order) => {
  if (!order) return;

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const primaryColor = [6, 161, 183]; 

  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 25, "F");

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("INVOICE / ORDER RECEIPT", 14, 16);

  // Order Metadata
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Order ID: #${order._id.toUpperCase()}`, 14, 35);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString("en-IN")}`, 14, 41);
  doc.text(`Order Status: ${order.orderStatus || "Processing"}`, 14, 47);
  doc.text(`Payment Method: ${order.paymentMethod}`, 120, 35);
  doc.text(`Payment Status: ${order.paymentStatus || "Pending"}`, 120, 41);

  // Divider Line
  doc.setDrawColor(220, 220, 220);
  doc.line(14, 53, 196, 53);

  // Shipping Address Section
  doc.setFont("helvetica", "bold");
  doc.text("SHIPPING ADDRESS:", 14, 60);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${order.shippingAddress?.fullName || ""}`, 14, 66);
  doc.text(`Street: ${order.shippingAddress?.street || ""}`, 14, 72);
  doc.text(`City/State: ${order.shippingAddress?.city || ""}, ${order.shippingAddress?.state || ""} - ${order.shippingAddress?.pincode || ""}`, 14, 78);
  doc.text(`Phone: ${order.shippingAddress?.phone || ""}`, 14, 84);

  doc.line(14, 90, 196, 90);

  // Table Header for Items
  doc.setFont("helvetica", "bold");
  doc.text("Item Description", 14, 98);
  doc.text("Qty", 130, 98);
  doc.text("Price", 160, 98);
  doc.text("Total", 185, 98);

  doc.line(14, 102, 196, 102);

  // Items Loop
  doc.setFont("helvetica", "normal");
  let startY = 110;
  order.orderItems?.forEach((item) => {
    const itemName = item.name.length > 40 ? item.name.substring(0, 37) + "..." : item.name;
    doc.text(itemName, 14, startY);
    doc.text(String(item.quantity), 132, startY);
    doc.text(`Rs.${item.price}`, 160, startY);
    doc.text(`Rs.${item.price * item.quantity}`, 185, startY);
    startY += 8;
  });

  doc.line(14, startY + 2, 196, startY + 2);

  // Total Calculation Section
  const isPaid = order.paymentStatus === "Completed";
  const totalLabel = isPaid ? "Total Amount Paid:" : "Total Amount Payable:";

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(totalLabel, 115, startY + 12);
  doc.setTextColor(...primaryColor);
  doc.text(`Rs.${order.totalAmount}`, 165, startY + 12);

  // Footer Message
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text("Thank you for shopping with us! This is a computer-generated receipt.", 14, 280);

  // Save PDF Document
  doc.save(`Receipt-${order._id.slice(-8).toUpperCase()}.pdf`);
  toast.success("PDF Receipt downloaded successfully!");
};