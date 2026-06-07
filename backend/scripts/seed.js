require('dotenv').config();

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const Customer = require('../src/models/Customer');
const Invoice = require('../src/models/Invoice');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await Invoice.deleteMany({});
  await Customer.deleteMany({});
  console.log('Cleared existing data');

  const raw = fs.readFileSync(path.join(__dirname, '../seed-data.json'), 'utf-8');
  const records = JSON.parse(raw);

  const customerMap = new Map();
  const uniqueCustomers = [...new Map(records.map((record) => [record.customer, record.company])).entries()]
    .map(([name, company]) => ({ name, company }));

  for (const customer of uniqueCustomers) {
    const doc = await Customer.create(customer);
    customerMap.set(doc.name, doc._id);
  }
  console.log(`Seeded ${uniqueCustomers.length} customers`);

  const invoiceDocs = records.map((record) => ({
    invoiceId: record.invoiceId,
    customerId: customerMap.get(record.customer),
    customer: record.customer,
    company: record.company,
    amount: record.amount,
    taxRate: record.taxRate,
    tax: record.tax,
    total: record.total,
    status: record.status,
    issueDate: new Date(record.issueDate),
    dueDate: new Date(record.dueDate)
  }));

  await Invoice.insertMany(invoiceDocs, { ordered: false });
  console.log(`Seeded ${invoiceDocs.length} invoices`);

  await mongoose.disconnect();
  console.log('Done. Seed complete.');
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
