export const descendingComparator = (a, b, orderBy) => {
  const from = orderBy !== "name" ? a[orderBy] : `${a["firstname"]} ${a["lastname"]}` 
  const to = orderBy !== "name" ? b[orderBy] : `${b["firstname"]} ${b["lastname"]}` 

  if (to < from) {
    return -1;
  }
  if (to > from) {
    return 1;
  }
  return 0;
}
  
export const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  
export const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}
 
export const roundToTwoDecimals = (number) => {
  return Math.round(number * 100) / 100
}

export const calculateSale = (serviceFees, from, selectedTransaction) => {

  const transactionTotalAmount = roundToTwoDecimals(selectedTransaction.amount * from.crypto.latest_crypto_rate.rate)
  const transactionServiceFees = roundToTwoDecimals((serviceFees / 100) * transactionTotalAmount)
  const transactionTotalAmountWithFees = roundToTwoDecimals(transactionTotalAmount - transactionServiceFees - from?.crypto.current_gas)

  const purchaseTransactionRate = selectedTransaction?.purchase_crypto_rate.rate;

  const purchaseTransactionTotalAmount = roundToTwoDecimals(selectedTransaction.amount * purchaseTransactionRate)

  const saleGains = roundToTwoDecimals(transactionTotalAmountWithFees - purchaseTransactionTotalAmount)

  const gains = {
    amount: saleGains,
    percent: roundToTwoDecimals((saleGains / purchaseTransactionTotalAmount) * 100)
}
  return {
    transactionTotalAmount,
    transactionTotalAmountWithFees,
    transactionServiceFees,
    gains
  }
}