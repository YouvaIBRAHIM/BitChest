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
  