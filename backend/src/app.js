require('dotenv').config();

const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');

const customerRoutes = require('./routes/customers');
const invoiceRoutes = require('./routes/invoices');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/]
  })
);
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/invoices', invoiceRoutes);
app.use('/api/customers', customerRoutes);

app.use((req, res, next) => {
  next(Object.assign(new Error('Route not found.'), { statusCode: 404 }));
});

app.use(errorHandler);

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    app.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start backend', error);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = app;
