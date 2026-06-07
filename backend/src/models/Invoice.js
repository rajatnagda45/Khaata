const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceId: { type: String, required: true, unique: true },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    customer: { type: String, required: true },
    company: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    taxRate: { type: Number, enum: [0, 3, 5, 18, 28], required: true },
    tax: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['Sent', 'Unpaid', 'Overdue', 'Paid', 'Void', 'Draft'],
      required: true
    },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true }
  },
  { timestamps: true }
);

InvoiceSchema.index({ customerId: 1, status: 1 });
InvoiceSchema.index({ status: 1 });
InvoiceSchema.index({ issueDate: -1 });
InvoiceSchema.index({ dueDate: 1 });
InvoiceSchema.index({ amount: 1 });
InvoiceSchema.index({ customer: 'text', invoiceId: 'text' });

module.exports = mongoose.model('Invoice', InvoiceSchema);
