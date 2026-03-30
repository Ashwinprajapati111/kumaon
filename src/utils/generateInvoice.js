// src/utils/generateInvoice.js
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = (order) => {
  const doc = new jsPDF();

  const logo = "/images/logo.png"; // from public folder
  const signature = "/images/signature.png"; // from public folder

  /* ================= HEADER ================= */
  try {
    doc.addImage(logo, "PNG", 150, 10, 40, 30);
  } catch {}

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(31, 41, 55);
  doc.text("Kumaon Organic", 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text("Gujarat, India", 14, 24);
  doc.text("GSTIN: 24ABCDE1234F1Z5", 14, 30);
  doc.text("Email: support@kumaonorganic.com", 14, 36);

  /* ================= TITLE ================= */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(161, 98, 7);
  doc.text("INVOICE", 14, 50);

  /* ================= ORDER INFO BOX ================= */
  const orderBoxX = 125;
  const orderBoxWidth = 70;
  doc.setDrawColor(209, 213, 219);
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(orderBoxX, 45, orderBoxWidth, 28, 3, 3, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(31, 41, 55);

  const orderIdText = doc.splitTextToSize(
    `Order ID: ${order._id}`,
    orderBoxWidth - 6
  );
  doc.text(orderIdText, orderBoxX + 3, 52);
  doc.text(
    `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
    orderBoxX + 3,
    62
  );
  doc.text(
    `Payment: ${order.payment?.method || "N/A"}`,
    orderBoxX + 3,
    68
  );

  /* ================= BILL TO ================= */
  const c = order.customer || {};
  doc.setFont("helvetica", "bold");
  doc.setTextColor(161, 98, 7);
  doc.text("Bill To", 14, 65);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(31, 41, 55);
  doc.text(`${c.firstName || ""} ${c.lastName || ""}`, 14, 71);
  doc.text(`Phone: ${c.phone || "-"}`, 14, 77);
  doc.text(`${c.address || "-"}`, 14, 83);
  doc.text(
    `${c.city || ""}, ${c.state || ""}, ${c.country || ""} - ${c.pincode || ""}`,
    14,
    89
  );

  /* ================= TABLE ================= */
  const rows = order.cart.map((item, i) => [
    i + 1,
    item.name,
    item.quantity,
    `Rs ${item.price.toFixed(2)}`,
    `Rs ${(item.price * item.quantity).toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: 100,
    head: [["#", "Product", "Qty", "Price", "Subtotal"]],
    body: rows,
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 10,
      cellPadding: 4,
      textColor: [31, 41, 55],
    },
    headStyles: {
      fillColor: [161, 98, 7],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [254, 243, 199],
    },
    tableLineColor: [209, 213, 219],
    tableLineWidth: 0.3,
  });

  /* ================= TOTAL BOX ================= */
  const subtotal =
    order.cart?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;
  const gst = subtotal * 0.18;
  const cgst = gst / 2;
  const sgst = gst / 2;
  const total = subtotal + gst;

  let finalY = doc.lastAutoTable.finalY + 15;
  const boxX = 120;
  const boxWidth = 75;
  const rightMargin = 10;
  const textRightX = boxX + boxWidth - rightMargin;

  doc.setFillColor(254, 243, 199);
  doc.roundedRect(boxX, finalY - 8, boxWidth, 40, 3, 3, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  // LEFT LABELS
  doc.text("Subtotal:", boxX + 5, finalY);
  doc.text("CGST (9%):", boxX + 5, finalY + 6);
  doc.text("SGST (9%):", boxX + 5, finalY + 12);

  // RIGHT VALUES
  doc.text(`Rs ${subtotal.toFixed(2)}`, textRightX, finalY, { align: "right" });
  doc.text(`Rs ${cgst.toFixed(2)}`, textRightX, finalY + 6, { align: "right" });
  doc.text(`Rs ${sgst.toFixed(2)}`, textRightX, finalY + 12, { align: "right" });

  // GRAND TOTAL
  doc.setFont("helvetica", "bold");
  doc.setTextColor(161, 98, 7);
  doc.text("Grand Total:", boxX + 5, finalY + 22);
  doc.text(`Rs ${total.toFixed(2)}`, textRightX, finalY + 22, { align: "right" });

  /* ================= SIGNATURE ================= */
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text("Authorized Signature", 14, finalY + 30);

  try {
    doc.addImage(signature, "PNG", 14, finalY + 32, 40, 20);
  } catch {}

  /* ================= FOOTER ================= */
  doc.setFontSize(9);
  doc.setTextColor(107, 114, 128);
  doc.text(
    "Thank you for your purchase! This is a system generated invoice.",
    14,
    285
  );

  /* ================= SAVE ================= */
  doc.save(`Invoice_${order._id}.pdf`);
};