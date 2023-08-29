import { Box, Checkbox, TableCell, TableRow } from '@mui/material';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';

const headCells = [
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      disableSort: false,
      label: 'Nom complet',
    },
    {
      id: 'email',
      numeric: false,
      disablePadding: false,
      disableSort: false,
      label: 'Email',
    },
    {
      id: 'balance',
      numeric: false,
      disablePadding: false,
      disableSort: false,
      label: 'Solde',
    },
    {
      id: 'actions',
      numeric: false,
      disablePadding: false,
      disableSort: true,
      label: 'Actions',
    }
];

const EnhancedTableHead = (props) => {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property, disableSort) => (event) => {
      if (!disableSort) {
        onRequestSort(event, property);
      }
    };
  
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all users',
              }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                hideSortIcon={headCell.disableSort}
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id, headCell.disableSort)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
}

export default EnhancedTableHead;