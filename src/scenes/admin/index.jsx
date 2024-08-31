import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useTheme,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import CustomColumnMenu from "components/DataGridCustomColumnMenu";

const defaultAdmins = {
  iabsId: 1,
  name: "John",
  region: "Andijon",
  role: "Admin",
};

const regions = [
  {
    id: 1,
    name: "Andijon",
  },
  {
    id: 2,
    name: "Tashkent",
  },
  {
    id: 3,
    name: "Samarkand",
  },
  {
    id: 4,
    name: "Namangan",
  },
  {
    id: 5,
    name: "Buxoro",
  },
  {
    id: 6,
    name: "Qoraqalpog`iston respublikasi",
  },
  {
    id: 7,
    name: "Fergana",
  },
  {
    id: 8,
    name: "Sirdaryo",
  },
  {
    id: 9,
    name: "Jizzax",
  },
  {
    id: 10,
    name: "Surxondaryo",
  },
  {
    id: 11,
    name: "Navoiy",
  },
  {
    id: 12,
    name: "Xorazm",
  },
  {
    id: 13,
    name: "Qashqadaryo",
  },
  {
    id: 14,
    name: "Toshkent viloyati",
  },
];

const columns = [
  { field: "iabsId", headerName: "iabs ID", flex: 0.5 },
  { field: "name", headerName: "Name", flex: 0.5 },
  { field: "region", headerName: "Region", flex: 0.4 },
  { field: "role", headerName: "Role", flex: 0.5 },
];

const Admin = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    iabsId: "",
    name: "",
    region: "",
    role: "",
  });

  const [admins, setAdmins] = useState([defaultAdmins]);

  useEffect(() => {
    setNewAdmin({
      iabsId: "",
      name: "",
      region: "",
      role: "",
    });
  }, [admins]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (e) =>
    setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });
  const handleSave = () => {
    console.log("New Admin Details:", newAdmin);
    setAdmins([...admins, { ...newAdmin }]);
    handleClose();
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Box display="flex" justifyContent="space-between">
        <Header title="ADMINS" subtitle="Managing admins and list of admins" />
        <Box display="flex" alignItems="center">
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{ "&:hover": { color: "#ffffff" } }}
          >
            Add Admin
          </Button>
        </Box>
      </Box>
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            color: theme.palette.secondary[100],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
          "& .MuiButton-contained:hover": {
            color: "white",
          },
        }}
      >
        <DataGrid
          loading={!admins}
          getRowId={(row) => row.iabsId}
          rows={admins || []}
          columns={columns}
          components={{
            ColumnMenu: CustomColumnMenu,
          }}
        />
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: "white", color: "#003366" }}>
          Add New User
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "white", color: "#003366" }}>
          <TextField
            autoFocus
            margin="dense"
            name="iabsId"
            label="iabs ID"
            type="text"
            fullWidth
            value={newAdmin.iabsId}
            onChange={handleChange}
            InputLabelProps={{
              style: { color: "#003366" },
            }}
            InputProps={{
              style: { color: "#003366" },
            }}
          />
          <TextField
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={newAdmin.name}
            onChange={handleChange}
            InputLabelProps={{
              style: { color: "#003366" },
            }}
            InputProps={{
              style: { color: "#003366" },
            }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel sx={{ color: "#003366" }}>Region</InputLabel>
            <Select
              name="region"
              value={newAdmin.region}
              onChange={handleChange}
              displayEmpty
              sx={{ color: "#003366" }}
            >
              <MenuItem value="Andijon">Andijon</MenuItem>
              <MenuItem value="Tashkent">Tashkent</MenuItem>
              <MenuItem value="Samarkand">Samarkand</MenuItem>

              {/* Add more regions as needed */}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel sx={{ color: "#003366" }}>Role</InputLabel>
            <Select
              name="role"
              value={newAdmin.role}
              onChange={handleChange}
              displayEmpty
              sx={{ color: "#003366" }}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Viloyat boshqarma boshlig`i">
                Viloyat boshqarma boshlig`i
              </MenuItem>
              <MenuItem value="Respublika xodimi"> Respublika xodimi</MenuItem>
              <MenuItem value="Viloyat xodimi"> Viloyat xodimi</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "white" }}>
          <Button onClick={handleClose} sx={{ color: "#003366" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: "#003366",
              color: "white",
              "&:hover": { backgroundColor: "#002244" },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Admin;
