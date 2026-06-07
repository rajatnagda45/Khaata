const express = require('express');
const {
  listInvoices,
  getInvoiceSummary,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice
} = require('../controllers/invoiceController');

const router = express.Router();

router.get('/summary', getInvoiceSummary);
router.get('/', listInvoices);
router.get('/:id', getInvoiceById);
router.post('/', createInvoice);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);

module.exports = router;
