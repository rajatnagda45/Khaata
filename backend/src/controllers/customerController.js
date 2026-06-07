const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const Invoice = require('../models/Invoice');

const STATUS_VALUES = ['Paid', 'Unpaid', 'Overdue', 'Draft', 'Sent', 'Void'];

function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

async function listCustomers(req, res, next) {
  try {
    const customers = await Customer.find({}, { name: 1, company: 1, initials: 1 })
      .sort({ name: 1 })
      .lean();

    res.json(customers);
  } catch (error) {
    next(error);
  }
}

async function getCustomerProfile(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, 'Invalid customer id.');
    }

    const customer = await Customer.findById(id, { name: 1, company: 1, initials: 1 }).lean();
    if (!customer) {
      throw createError(404, 'Customer not found.');
    }

    const [metricsResult, statusBreakdownResult] = await Promise.all([
      Invoice.aggregate([
        { $match: { customerId: new mongoose.Types.ObjectId(id) } },
        {
          $group: {
            _id: null,
            totalBilled: { $sum: '$total' },
            totalTax: { $sum: '$tax' },
            outstanding: {
              $sum: {
                $cond: [{ $in: ['$status', ['Unpaid', 'Overdue', 'Sent']] }, '$total', 0]
              }
            },
            invoiceCount: { $sum: 1 }
          }
        }
      ]),
      Invoice.aggregate([
        { $match: { customerId: new mongoose.Types.ObjectId(id) } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    const metrics = {
      totalBilled: Number((metricsResult[0]?.totalBilled || 0).toFixed(2)),
      totalTax: Number((metricsResult[0]?.totalTax || 0).toFixed(2)),
      outstanding: Number((metricsResult[0]?.outstanding || 0).toFixed(2)),
      invoiceCount: metricsResult[0]?.invoiceCount || 0,
      statusBreakdown: STATUS_VALUES.reduce((accumulator, status) => {
        accumulator[status] = 0;
        return accumulator;
      }, {})
    };

    statusBreakdownResult.forEach((statusItem) => {
      metrics.statusBreakdown[statusItem._id] = statusItem.count;
    });

    res.json({ customer, metrics });
  } catch (error) {
    next(error);
  }
}

async function getCustomerInvoices(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, 'Invalid customer id.');
    }

    const page = parsePositiveInteger(req.query.page, 1);
    const limit = Math.min(parsePositiveInteger(req.query.limit, 50), 100);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Invoice.find({ customerId: id }).sort({ issueDate: -1 }).skip(skip).limit(limit).lean(),
      Invoice.countDocuments({ customerId: id })
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

module.exports = {
  listCustomers,
  getCustomerProfile,
  getCustomerInvoices
};
