import { FormControl, IconButton, InputLabel, MenuItem, Select, Toolbar, Tooltip, Typography } from "@mui/material";
import { Trash  } from "@phosphor-icons/react";
import { alpha } from '@mui/material/styles';
import SearchField from "../SearchField";


const EnhancedTableToolbar = ({ 
  selected, 
  perPage, 
  setPerPage, 
  role, 
  setRole, 
  filterOptions,
  search,
  setSearch,
  handleClickOpenDialog 
}) => {
  
    const handleChangePerPage = (e) => {
      setPerPage(e.target.value)
    }
    const handleChangeRole = (e) => {
      setRole(e.target.value)
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
          <Tooltip 
            title="Supprimer" 
            sx={{ margin:1 }}
          >
            <IconButton
              onClick={() => handleClickOpenDialog(selected)}
            >
              <Trash />
            </IconButton>
          </Tooltip>
        ) : (
          <div className="flex items-center flex-wrap gap-4  m-1">
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
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel id="RoleId">Rôle</InputLabel>
              <Select
                labelId="RoleId"
                id="RoleId"
                value={role}
                label="Par rôle"
                onChange={handleChangeRole}
              >
                <MenuItem value={"admin"}>Admin</MenuItem>
                <MenuItem value={"client"}>Client</MenuItem>
              </Select>
            </FormControl>
          </div>
        )}
      </Toolbar>
    );
}

export default EnhancedTableToolbar;
  