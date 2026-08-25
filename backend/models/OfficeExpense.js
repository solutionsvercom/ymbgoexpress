const mongoose = require('mongoose');

const officeItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, default: 0, min: 0 },
    note: { type: String, default: '', trim: true }
  },
  { _id: false }
);

const officeExpenseSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true, trim: true },
    officeName: { type: String, default: 'Office Kharcha', trim: true },
    items: { type: [officeItemSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('OfficeExpense', officeExpenseSchema);
