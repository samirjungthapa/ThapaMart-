import PDFDocument from 'pdfkit';

export const generateInvoicePdfBuffer = (order, user) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', err => reject(err));

    // Logo & Header
    doc.fontSize(24).font('Helvetica-Bold').text('THAPAMART', { align: 'center' });
    doc.fontSize(10).font('Helvetica').text('PREMIUM E-COMMERCE PLATFORM', { align: 'center' });
    doc.moveDown(2);

    // Invoice Meta Info
    doc.fontSize(14).font('Helvetica-Bold').text('INVOICE', { underline: true });
    doc.fontSize(10).font('Helvetica');
    doc.text(`Invoice Number: INV-${order.id || order._id}`);
    doc.text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString()}`);
    doc.text(`Order Status: ${order.orderStatus}`);
    doc.text(`Payment Status: ${order.paymentStatus}`);
    doc.moveDown(1.5);

    // Customer Info
    doc.fontSize(12).font('Helvetica-Bold').text('Bill To:');
    doc.fontSize(10).font('Helvetica');
    doc.text(`Name: ${user.name || 'Valued Customer'}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Phone: ${user.phone || 'N/A'}`);
    doc.text(`Address: ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`);
    doc.moveDown(2);

    // Table Header
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Item Description', 50, doc.y, { width: 250 });
    doc.text('Qty', 300, doc.y, { width: 50, align: 'center' });
    doc.text('Price', 350, doc.y, { width: 80, align: 'right' });
    doc.text('Total', 450, doc.y, { width: 100, align: 'right' });
    doc.moveDown(0.5);

    // Draw thin line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#E5E7EB').stroke();
    doc.moveDown(0.5);

    // Items List
    doc.font('Helvetica').fontSize(10);
    order.products.forEach(p => {
      const itemTotal = p.price * p.quantity;
      doc.text(p.title, 50, doc.y, { width: 250 });
      doc.text(p.quantity.toString(), 300, doc.y, { width: 50, align: 'center' });
      doc.text(`Rs. ${p.price.toLocaleString()}`, 350, doc.y, { width: 80, align: 'right' });
      doc.text(`Rs. ${itemTotal.toLocaleString()}`, 450, doc.y, { width: 100, align: 'right' });
      doc.moveDown(0.5);
    });

    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#E5E7EB').stroke();
    doc.moveDown(1);

    // Totals
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Total Amount:', 350, doc.y, { width: 100 });
    doc.text(`Rs. ${Number(order.totalPrice).toLocaleString()}`, 450, doc.y, { width: 100, align: 'right' });

    // Footer
    doc.moveDown(4);
    doc.fontSize(10).font('Helvetica-Oblique').text('Thank you for shopping with ThapaMart!', { align: 'center' });

    doc.end();
  });
};
