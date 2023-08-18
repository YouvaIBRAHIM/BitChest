import { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import EnhancedTableHead from "../components/UsersPageComponent/EnhancedTableHead"
import EnhancedTableToolbar from "../components/UsersPageComponent/EnhancedTableToolbar"
import { getComparator, stableSort } from '../services/Utils.service';
import { useUsers } from '../services/Hook.service';
import { Pagination, Stack } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import TableSkeleton from '../components/TableSkeleton';

const filterOptions = [
  {
    label: "Nom",
    value: "name"
  },
  {
    label: "Email",
    value: "email"
  },
]

const UsersPage = () => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const [perPage, setPerPage] = useState(10);
  const [role, setRole] = useState("client");
  const [search, setSearch] = useState({text: "", filter: "name"});
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState({isLoading: false, error: null});

  
  useEffect(() => {
    useUsers(setUsers, setStatus, search, page, perPage, role)
  }, [page, perPage, role, search])


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (users?.data && users?.data.length === selected.length) {
      setSelected([]);
      return;
    }
    if (event.target.checked && users?.data) {
      const newSelected = users?.data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const visibleRows = useMemo(() =>{
    if (users?.data) {
      return stableSort(users?.data, getComparator(order, orderBy))
    }else{
      return []
    }
  },[users, order, orderBy]);

  const handleChangePage = useCallback((e, value) => {
    setPage(value);
    setSearchParams({page: value})
  }, [])

  const renderTableBody = useCallback(() => {
    if (status.isLoading) {
      return <TableSkeleton rows={10} cells={4}/>
    }else if (visibleRows) {
      return (
      <TableBody>
        {visibleRows.map((row, index) => {
          const isItemSelected = isSelected(row.id);
          const labelId = `enhanced-table-checkbox-${index}`;
          return (
            <TableRow
              hover
              onClick={(event) => handleClick(event, row.id)}
              role="checkbox"
              aria-checked={isItemSelected}
              tabIndex={-1}
              key={row.id}
              selected={isItemSelected}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={isItemSelected}
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </TableCell>
              <TableCell
                component="th"
                id={labelId}
                scope="row"
                padding="none"
              >
                {row.name}
              </TableCell>
              <TableCell align="left">{row.email}</TableCell>
              <TableCell align="left">{row.balance}€</TableCell>
            </TableRow>
          );
        })}

      </TableBody>
      )
    }
  }, [status, selected]);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar 
          filterOptions={filterOptions} 
          numSelected={selected.length} 
          perPage={perPage} 
          setPerPage={setPerPage} 
          role={role} 
          setRole={setRole} 
          search={search} 
          setSearch={setSearch}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={visibleRows.length}
            />
          {renderTableBody()}
          </Table>
        </TableContainer>
      </Paper>
        <Stack spacing={2} className='fixed bottom-5 right-5'>
          <Pagination count={users.total ? Math.ceil(users.total / perPage) : 0} page={Number(page)} siblingCount={5} onChange={handleChangePage}/>
        </Stack>
    </Box>
  );
}

export default UsersPage;