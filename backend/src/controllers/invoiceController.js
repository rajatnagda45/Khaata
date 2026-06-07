const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const Invoice = require('../models/Invoice');

const STATUS_VALUES = ['Sent', 'Unpaid', 'Overdue', 'Paid', 'Void', 'Draft'];
const TAX_RATES = [0, 3, 5, 18, 28];

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function computeTotals(amount, taxRate) {
  const tax = Number.parseFloat(((amount * taxRate) / 100).toFixed(2));
  const total = Number.parseFloat((amount + tax).toFixed(2));
  return { tax, total };
}

async function resolveCustomer(customerId) {
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    throw createError(400, 'A valid customerId is required.');
  }

  const customer = await Customer.findById(customerId).lean();
  if (!customer) {
    throw createError(404, 'Customer not found.');
  }

  return customer;
}

async function generateInvoiceId() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const invoiceId = `INV-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const existing = await Invoice.exists({ invoiceId });
    if (!existing) {
      return invoiceId;
    }
  }

  throw createError(500, 'Unable to generate a unique invoice ID.');
}

function buildInvoiceFilter(query) {
  const {
    status,
    taxRate,
    customer,
    search,
    issueDateFrom,
    issueDateTo,
    dueDateFrom,
    dueDateTo,
    amountMin,
    amountMax
  } = query;

  const filter = {};

  if (status) {
    if (!STATUS_VALUES.includes(status)) {
      throw createError(400, 'Invalid status filter.');
    }
    filter.status = status;
  }

  if (taxRate !== undefined && taxRate !== '') {
    const rate = Number(taxRate);
    if (!TAX_RATES.includes(rate)) {
      throw createError(400, 'Invalid taxRate filter.');
    }
    filter.taxRate = rate;
  }

  if (customer) {
    filter.customer = new RegExp(`^${escapeRegex(customer)}$`, 'i');
  }

  if (search) {
    const searchRegex = new RegExp(escapeRegex(search), 'i');
    filter.$or = [
      { customer: searchRegex },
      { company: searchRegex },
      { invoiceId: searchRegex }
    ];
  }

  if (issueDateFrom || issueDateTo) {
    filter.issueDate = {};
    if (issueDateFrom) {
      filter.issueDate.$gte = new Date(issueDateFrom);
    }
    if (issueDateTo) {
      filter.issueDate.$lte = new Date(issueDateTo);
    }
  }

  if (dueDateFrom || dueDateTo) {
    filter.dueDate = {};
    if (dueDateFrom) {
      filter.dueDate.$gte = new Date(dueDateFrom);
    }
    if (dueDateTo) {
      filter.dueDate.$lte = new Date(dueDateTo);
    }
  }

  if (amountMin !== undefined || amountMax !== undefined) {
    filter.amount = {};
    if (amountMin !== undefined && amountMin !== '') {
      filter.amount.$gte = Number(amountMin);
    }
    if (amountMax !== undefined && amountMax !== '') {
      filter.amount.$lte = Number(amountMax);
    }
  }

  return filter;
}

async function listInvoices(req, res, next) {
  try {
    const page = parsePositiveInteger(req.query.page, 1);
    const limit = Math.min(parsePositiveInteger(req.query.limit, 20), 100);
    const sortField = ['amount', 'dueDate', 'issueDate'].includes(req.query.sortBy)
      ? req.query.sortBy
      : 'issueDate';
    const sort = { [sortField]: req.query.sortOrder === 'asc' ? 1 : -1 };
    const filter = buildInvoiceFilter(req.query);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Invoice.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Invoice.countDocuments(filter)
    ]);

    res.json({
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getInvoiceSummary(req, res, next) {
  try {
    const [globalMetrics] = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          totalBilled: { $sum: '$total' },
          totalTax: { $sum: '$tax' },
          invoiceCount: { $sum: 1 }
        }
      }
    ]);

    const [topCustomers, customerCount, statusCounts] = await Promise.all([
      Invoice.aggregate([
        {
          $group: {
            _id: '$customer',
            company: { $first: '$company' },
            totalBilled: { $sum: '$total' },
            invoiceCount: { $sum: 1 }
          }
        },
        { $sort: { totalBilled: -1 } },
        { $limit: 5 },
        {
          $project: {
            _id: 0,
            name: '$_id',
            company: 1,
            totalBilled: { $round: ['$totalBilled', 2] },
            invoiceCount: 1
          }
        }
      ]),
      Customer.countDocuments(),
      Invoice.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    const statusBreakdown = STATUS_VALUES.reduce((accumulator, status) => {
      accumulator[status] = 0;
      return accumulator;
    }, {});

    statusCounts.forEach((item) => {
      statusBreakdown[item._id] = item.count;
    });

    res.json({
      totalBilled: Number((globalMetrics?.totalBilled || 0).toFixed(2)),
      totalTax: Number((globalMetrics?.totalTax || 0).toFixed(2)),
      invoiceCount: globalMetrics?.invoiceCount || 0,
      customerCount,
      topCustomers,
      statusBreakdown
    });
  } catch (error) {
    next(error);
  }
}

async function getInvoiceById(req, res, next) {
  try {
    const invoice = await Invoice.findById(req.params.id).lean();
    if (!invoice) {
      throw createError(404, 'Invoice not found.');
    }

    res.json(invoice);
  } catch (error) {
    next(error);
  }
}

async function createInvoice(req, res, next) {
  try {
    const {
      customerId,
      amount,
      taxRate,
      issueDate,
      dueDate,
      status = 'Draft'
    } = req.body;

    if (
      customerId === undefined ||
      amount === undefined ||
      taxRate === undefined ||
      !issueDate ||
      !dueDate
    ) {
      throw createError(400, 'customerId, amount, taxRate, issueDate, and dueDate are required.');
    }

    const numericAmount = Number(amount);
    const numericTaxRate = Number(taxRate);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      throw createError(400, 'Amount must be greater than 0.');
    }
    if (!TAX_RATES.includes(numericTaxRate)) {
      throw createError(400, 'Invalid taxRate.');
    }
    if (!STATUS_VALUES.includes(status)) {
      throw createError(400, 'Invalid status.');
    }

    const issueDateValue = new Date(issueDate);
    const dueDateValue = new Date(dueDate);
    if (Number.isNaN(issueDateValue.getTime()) || Number.isNaN(dueDateValue.getTime())) {
      throw createError(400, 'Invalid issue or due date.');
    }
    if (dueDateValue < issueDateValue) {
      throw createError(400, 'Due date must be on or after issue date.');
    }

    const customer = await resolveCustomer(customerId);
    const { tax, total } = computeTotals(numericAmount, numericTaxRate);
    const invoiceId = await generateInvoiceId();

    const invoice = await Invoice.create({
      invoiceId,
      customerId: customer._id,
      customer: customer.name,
      company: customer.company,
      amount: numericAmount,
      taxRate: numericTaxRate,
      tax,
      total,
      status,
      issueDate: issueDateValue,
      dueDate: dueDateValue
    });

    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
}

async function updateInvoice(req, res, next) {
  try {
    const existingInvoice = await Invoice.findById(req.params.id);
    if (!existingInvoice) {
      throw createError(404, 'Invoice not found.');
    }

    const nextCustomerId = req.body.customerId || existingInvoice.customerId;
    const customer = await resolveCustomer(nextCustomerId);

    const numericAmount =
      req.body.amount !== undefined ? Number(req.body.amount) : existingInvoice.amount;
    const numericTaxRate =
      req.body.taxRate !== undefined ? Number(req.body.taxRate) : existingInvoice.taxRate;
    const nextStatus = req.body.status || existingInvoice.status;
    const issueDateValue = req.body.issueDate
      ? new Date(req.body.issueDate)
      : existingInvoice.issueDate;
    const dueDateValue = req.body.dueDate ? new Date(req.body.dueDate) : existingInvoice.dueDate;

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      throw createError(400, 'Amount must be greater than 0.');
    }
    if (!TAX_RATES.includes(numericTaxRate)) {
      throw createError(400, 'Invalid taxRate.');
    }
    if (!STATUS_VALUES.includes(nextStatus)) {
      throw createError(400, 'Invalid status.');
    }
    if (Number.isNaN(new Date(issueDateValue).getTime()) || Number.isNaN(new Date(dueDateValue).getTime())) {
      throw createError(400, 'Invalid issue or due date.');
    }
    if (new Date(dueDateValue) < new Date(issueDateValue)) {
      throw createError(400, 'Due date must be on or after issue date.');
    }

    const { tax, total } = computeTotals(numericAmount, numericTaxRate);

    existingInvoice.customerId = customer._id;
    existingInvoice.customer = customer.name;
    existingInvoice.company = customer.company;
    existingInvoice.amount = numericAmount;
    existingInvoice.taxRate = numericTaxRate;
    existingInvoice.tax = tax;
    existingInvoice.total = total;
    existingInvoice.status = nextStatus;
    existingInvoice.issueDate = issueDateValue;
    existingInvoice.dueDate = dueDateValue;

    await existingInvoice.save();

    res.json(existingInvoice);
  } catch (error) {
    next(error);
  }
}

async function deleteInvoice(req, res, next) {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      throw createError(404, 'Invoice not found.');
    }

    res.json({ message: 'Invoice deleted successfully.' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listInvoices,
  getInvoiceSummary,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice
};
