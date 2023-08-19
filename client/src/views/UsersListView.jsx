import { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import EnhancedTableHead from "../components/UsersListViewComponents/EnhancedTableHead"
import EnhancedTableToolbar from "../components/UsersListViewComponents/EnhancedTableToolbar"
import { getComparator, stableSort } from '../services/Utils.service';
import { useDebounce, useDeleteUsers, useUsers } from '../services/Hook.service';
import { IconButton, Pagination, Stack, Tooltip } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TableSkeleton from '../components/TableSkeleton';
import { PencilSimpleLine, Trash } from '@phosphor-icons/react';
import CustomSnackbar from '../components/CustomSnackbar';
import CustomDialog from '../components/CustomDialog';

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

const UsersListView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const [perPage, setPerPage] = useState(10);
  const [role, setRole] = useState("client");
  const [search, setSearch] = useState({text: "", filter: "name"});
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState({isLoading: false, type: "", message: "", snackBar: false});
  const [dialog, setDialog] = useState(false);

  const navigate = useNavigate();

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch) {
      useUsers(setUsers, setStatus, debouncedSearch, page, perPage, role)
    }
  }, [page, perPage, role, debouncedSearch])

  const handleClickOpenDialog = (item) => {
    setDialog(item);
  };

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
    if (event.target.closest('.actionButtons')) {
      return;
    }
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


  const handleChangePage = useCallback((e, value) => {
    setPage(value);
    setSearchParams({page: value})
  }, [])

  const handleCloseSnackBar = useCallback((e, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setStatus(oldValue => { return {...oldValue, snackBar: false}});
  }, [])
  
  const renderTableBody = useCallback(() => {
    const visibleRows = (users?.data) ? stableSort(users?.data, getComparator(order, orderBy)): []

    if (status.isLoading) {
      return <TableSkeleton rows={10} cells={5}/>
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
                {row.firstname} {row.lastname?.toUpperCase()}
              </TableCell>
              <TableCell align="left">{row.email}</TableCell>
              <TableCell align="left">{row.balance}€</TableCell>
              <TableCell align="left">
                  <div className='actionButtons'>
                    <Tooltip title='Éditer' onClick={()=> navigate(`/users/${row.id}`)}>
                      <IconButton aria-label="action" size="small">
                        <PencilSimpleLine fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Supprimer'>
                      <IconButton 
                        aria-label="action" 
                        size="small"
                        onClick={() => handleClickOpenDialog([row.id])}
                      >
                        <Trash fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </TableCell>
            </TableRow>
          );
        })}

      </TableBody>
      )
    }
  }, [status, selected, users, order, orderBy]);

  const handleConfimDelete = useCallback(() => {
    useDeleteUsers(setUsers, setStatus, dialog)
    setDialog(false);
    setSelected([]);
  }, [dialog]);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 10 }}>
        <EnhancedTableToolbar 
          filterOptions={filterOptions} 
          selected={selected} 
          perPage={perPage} 
          setPerPage={setPerPage} 
          role={role} 
          setRole={setRole} 
          search={search} 
          setSearch={setSearch}
          handleClickOpenDialog={handleClickOpenDialog}
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
              rowCount={users.data?.length}
            />
          {renderTableBody()}
          </Table>
        </TableContainer>
      </Paper>
        <Stack spacing={2} className='fixed bottom-5 right-5'>
          <Pagination color='primary' count={users.total ? Math.ceil(users.total / perPage) : 0} page={Number(page)} siblingCount={5} onChange={handleChangePage}/>
        </Stack>
        <CustomSnackbar open={status.snackBar} handleClose={handleCloseSnackBar} type={status.type} message={status.message}/>
        <CustomDialog 
          dialog={dialog} 
          setDialog={setDialog} 
          items={users.data} 
          itemKey={"email"} 
          message={`${dialog.length > 1 ? "Voulez-vous vraiment supprimer ces utilisateurs ?" : "Voulez-vous vraiment supprimer cet utilisateur ?"}`}
          onConfirm={handleConfimDelete}
        />
    </Box>
  );
}

export default UsersListView;