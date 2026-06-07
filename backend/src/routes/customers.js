const express = require('express');
const {
  listCustomers,
  getCustomerProfile,
  getCustomerInvoices
} = require('../controllers/customerController');

const router = express.Router();

router.get('/', listCustomers);
router.get('/:id/invoices', getCustomerInvoices);
router.get('/:id', getCustomerProfile);

module.exports = router;
