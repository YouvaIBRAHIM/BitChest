import { Skeleton, TableBody, TableCell, TableRow } from "@mui/material";

const TableSkeleton = ({rows, cells}) => {

  return (
    <TableBody>
      {[...Array(rows)].map((row, index) => (
        <TableRow
          key={index}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
        {[...Array(cells)].map((cell, cellIndex) => (
          <TableCell 
            align="right"
            key={cellIndex}
          >
            <Skeleton  variant="rectangular" className="w-full rounded" height={25}/>
          </TableCell>
        ))}
        </TableRow>
      ))}
  </TableBody>
  )
};


export default TableSkeleton;
