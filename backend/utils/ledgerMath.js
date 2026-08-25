function money(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function ledgerTotals(doc = {}) {
  const receipts = doc.receipts || {};
  const expenses = doc.expenses || {};
  const receiptTotal =
    money(receipts.redbus) +
    money(receipts.mentis) +
    money(receipts.indoreOffice) +
    money(receipts.ujjainOffice) +
    money(receipts.luggageOffice);
  const otherTotal = Array.isArray(expenses.otherItems)
    ? expenses.otherItems.reduce((sum, item) => sum + money(item.amount), 0)
    : money(expenses.others);
  const expenseTotal =
    money(expenses.diesel) +
    money(expenses.tollBooth) +
    money(expenses.urea) +
    otherTotal;
  return {
    receiptTotal,
    expenseTotal,
    balance: receiptTotal - expenseTotal
  };
}

function officeTotal(doc = {}) {
  return (doc.items || []).reduce((sum, item) => sum + money(item.amount), 0);
}

function withLedgerTotals(doc) {
  const plain = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  return { ...plain, ...ledgerTotals(plain) };
}

function withOfficeTotals(doc) {
  const plain = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  return { ...plain, total: officeTotal(plain) };
}

module.exports = { money, ledgerTotals, officeTotal, withLedgerTotals, withOfficeTotals };
