import { FormControl, IconButton, InputLabel, MenuItem, Select, Toolbar, Tooltip, Typography } from "@mui/material";
import { Trash  } from "@phosphor-icons/react";
import { alpha } from '@mui/material/styles';

const EnhancedTableToolbar = (props) => {
    const { numSelected, perPage, setPerPage, role, setRole } = props;
  
    const handleChangePerPage = (e) => {
      setPerPage(e.target.value)
    }
    const handleChangeRole = (e) => {
      setRole(e.target.value)
    }
    
    return (
      <Toolbar
        sx={{
          height: 75,
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {`${numSelected} sélectionné${numSelected > 1 ? "s" : ""}`} 
          </Typography>
        ) : (
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Utilisateurs
          </Typography>
        )}
  
        {numSelected > 0 ? (
          <Tooltip title="Supprimer">
            <IconButton>
              <Trash />
            </IconButton>
          </Tooltip>
        ) : (
          <div className="flex items-center gap-5">
            <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
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
            <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
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
  