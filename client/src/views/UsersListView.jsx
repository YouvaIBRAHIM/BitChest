import { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import EnhancedTableHead from "../components/UserComponents/UsersListViewComponents/EnhancedTableHead"
import EnhancedTableToolbar from "../components/UserComponents/UsersListViewComponents/EnhancedTableToolbar"
import { getComparator, stableSort } from '../services/Utils.service';
import { useDebounce } from '../services/Hook.service';
import { IconButton, Pagination, Stack, Tooltip } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TableSkeleton from '../components/Skeletons/TableSkeleton';
import { PencilSimpleLine, Trash } from '@phosphor-icons/react';
import CustomSnackbar from '../components/CustomSnackbar';
import CustomConfirmationDialog from '../components/CustomConfirmationDialog';
import CustomSpeedDial from '../components/CustomSpeedDial';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteUser, deleteUsers, getUsers } from '../services/Api.service';

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
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(searchParams.get("page") ?? 1);
  const [perPage, setPerPage] = useState(10);
  const [role, setRole] = useState("client");
  const [search, setSearch] = useState({text: "", filter: "name"});
  const [snackBar, setSnackBar] = useState({message: "", showSnackBar: false, type: "info"});
  const [dialog, setDialog] = useState(false);
  const debouncedSearch = useDebounce(search, 500);

  const { data: users, isFetching, refetch } = useQuery({ 
    queryKey: ['userList'], 
    queryFn: () =>  getUsers(page, perPage, role, search),
    retry: 3,
    refetchInterval: false,
    enabled: false,
    onError: (error) => setSnackBar({message: error, showSnackBar: true, type: "error"})
  });

  const deleteUserMutation = useMutation({
    mutationFn: (deleteFetch) => deleteFetch(),
    onSuccess: (data) => {
        users.data = users?.data?.filter(user => !data?.data?.includes(user.id))
        if (users.data.length === 0) {
          refetch()
        }else{
          users.total = users.total - data?.data?.length
          queryClient.setQueryData(['userList'], users)
        }
        setSnackBar({
          message: data?.data?.length > 1 ? "Les utilisateurs ont été supprimés." :"L'utilisateur a été supprimé.", 
          showSnackBar: true, 
          type: "success"
        });
    },
    onError: error => {
        setSnackBar({message: error, showSnackBar: true, type: "error"});
    }
  })
  

  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedSearch) {
      refetch(page, perPage, role, debouncedSearch)
    }
  }, [page, perPage, role, debouncedSearch.text])

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

    setSnackBar({message: "", snackBar: false, type: "info"});
  }, [])
  
  const renderTableBody = useCallback(() => {
    const visibleRows = (users?.data) ? stableSort(users?.data, getComparator(order, orderBy)): []

    if (isFetching) {
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
              className={`${row?.isNewRow && "bg-yellow-500"}`}
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
                        <PencilSimpleLine fontSize="inherit" weight="duotone" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Supprimer'>
                      <IconButton 
                        aria-label="action" 
                        size="small"
                        onClick={() => handleClickOpenDialog([row.id])}
                      >
                        <Trash fontSize="inherit" weight="duotone" />
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
  }, [isFetching, selected, users, order, orderBy]);

  const handleConfimDelete = useCallback((selected) => {
    const userFetchFunction = selected.length > 1 ? () => deleteUsers(selected) : () => deleteUser(selected[0])
    deleteUserMutation.mutate(() => userFetchFunction())  

    setDialog(false);
    setSelected([]);
  }, [dialog, selected]);

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
              rowCount={users?.data?.length}
            />
          {renderTableBody()}
          </Table>
        </TableContainer>
      </Paper>
        <Stack spacing={2} className='fixed bottom-5 right-24'>
          <Pagination color='primary' count={users?.total ? Math.ceil(users.total / perPage) : 0} page={Number(page)} siblingCount={5} onChange={handleChangePage}/>
        </Stack>
        <CustomSnackbar open={snackBar.showSnackBar} handleClose={handleCloseSnackBar} type={snackBar.type} message={snackBar.message}/>
        <CustomConfirmationDialog 
          dialog={dialog} 
          setDialog={setDialog} 
          items={users?.data} 
          itemKey={"email"} 
          message={`Voulez-vous vraiment supprimer ${dialog.length > 1 ? "ces utilisateurs" : "cet utilisateur"} ?`}
          onConfirm={handleConfimDelete}
        />
        <CustomSpeedDial setSnackBar={setSnackBar}/>
    </Box>
  );
}

export default UsersListView;