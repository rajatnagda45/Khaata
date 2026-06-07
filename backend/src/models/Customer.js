const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    company: { type: String, required: true, trim: true },
    initials: { type: String }
  },
  { timestamps: true }
);

CustomerSchema.pre('save', function computeInitials(next) {
  const parts = this.name.trim().split(/\s+/);
  this.initials = parts.map((part) => part[0].toUpperCase()).join('').slice(0, 2);
  next();
});

module.exports = mongoose.model('Customer', CustomerSchema);
