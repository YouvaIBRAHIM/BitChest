import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, Toolbar, Tooltip, Typography } from "@mui/material";
import { ArrowCounterClockwise, Trash  } from "@phosphor-icons/react";
import { alpha } from '@mui/material/styles';
import SearchField from "./SearchField";

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


const TableToolbar = ({ 
  selected, 
  perPage, 
  setPerPage, 
  role, 
  setRole, 
  search,
  setSearch,
  userStatus,
  setUserStatus,
  handleClickOpenDialog,
  setActionType 
}) => {
  
    const handleChangePerPage = (e) => {
      setPerPage(e.target.value)
    }
    const handleChangeRole = (e) => {
      setRole(e.target.value)
    }

    const handleChangeUserStatus = (e) => {
      setUserStatus(e.target.value)
    }

    const handleAction = (type) => {
      setActionType(type);
      handleClickOpenDialog(selected); 
    }
    
    return (
      <Toolbar
        sx={{
          minHeight: 75,
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(selected.length > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
        className="flex flex-wrap justify-between"
      >
        {selected.length > 0 ? (
          <Typography
            sx={{ margin:1 }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {`${selected.length} sélectionné${selected.length > 1 ? "s" : ""}`} 
          </Typography>
        ) : (
          <Typography
            sx={{ margin:1 }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Utilisateurs
          </Typography>
        )}
  
        {selected.length > 0 ? (
          <Box>
            {
              userStatus === "disabled" &&
              <Tooltip 
                title="Restaurer" 
                sx={{ margin:1 }}
              >
                <IconButton
                  onClick={() => handleAction("restore")}
                >
                  <ArrowCounterClockwise size={24} weight="duotone" />
                </IconButton>
              </Tooltip>
            }
            <Tooltip 
              title="Supprimer" 
              sx={{ margin:1 }}
            >
              <IconButton
                onClick={() => handleAction("delete")}
              >
                <Trash  size={24} weight="duotone"/>
              </IconButton>
            </Tooltip>

          </Box>
        ) : (
          <Box className="flex items-center flex-wrap gap-4  m-1">
            <SearchField 
              filterOptions={filterOptions}
              search={search} 
              setSearch={setSearch}
            />
            <FormControl sx={{ minWidth: 100 }} size="small">
              <InputLabel id="perPageId">Par page</InputLabel>
              <Select
                labelId="perPageId"
                id="perPageId"
                value={perPage}
                label="Par page"
                onChange={handleChangePerPage}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 125 }} size="small">
              <InputLabel id="RoleId">Rôle</InputLabel>
              <Select
                labelId="RoleId"
                id="RoleId"
                value={role}
                label="Rôle"
                onChange={handleChangeRole}
              >
                <MenuItem value={"admin"}>Admin</MenuItem>
                <MenuItem value={"client"}>Client</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 100 }} size="small">
              <InputLabel id="RoleId">Statut</InputLabel>
              <Select
                labelId="RoleId"
                id="RoleId"
                value={userStatus}
                label="Statut"
                onChange={handleChangeUserStatus}
              >
                <MenuItem value="enabled">Actifs</MenuItem>
                <MenuItem value="disabled">Inactifs</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}
      </Toolbar>
    );
}

export default TableToolbar;
  