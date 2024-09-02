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
import { RoleEnum, regions, StorageItemNameEnum } from "constants.js";

const Admin = () => {
  const theme = useTheme();
  const [userInfo, setUserInfo] = useState({});
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    iabsId: "",
    name: "",
    username: "",
    password: "",
    role: "",
    region: "",
  });

  const [admins, setAdmins] = useState([]);

  const columns = [
    { field: "iabsId", headerName: "iabs ID", flex: 0.5 },
    { field: "name", headerName: "Name", flex: 0.5 },
    {
      field: "region",
      headerName: "Region",
      flex: 0.4,
      valueGetter: (params) => {
        const region = regions.find((r) => r.id === params.value);
        return region ? region.name : "Not defined";
      },
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,
      // valueGetter: (params) => RoleEnum[params.value] || "Not defined",
    },
    {
      field: "control",
      headerName: "Control",
      flex: 0.5,
      renderCell: (params) => {
        if (userInfo.role !== RoleEnum.ADMIN) {
          return "You don't have access";
        } else {
          return (
            <Box>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#003366",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#002244",
                  },
                  marginRight: "8px", // Adding space between buttons
                }}
                onClick={() => handleEdit(params.row)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(params.row.iabsId)}
              >
                Delete
              </Button>
            </Box>
          );
        }
      },
    },
  ];

  useEffect(() => {
    const storedUserInfo = JSON.parse(
      localStorage.getItem(StorageItemNameEnum.USER_INFO)
    );
    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
    }

    const storedAdmins = JSON.parse(
      localStorage.getItem(StorageItemNameEnum.USERS)
    );
    if (storedAdmins) {
      const me = JSON.parse(
        localStorage.getItem(StorageItemNameEnum.USER_INFO)
      );
      if (storedUserInfo.role === RoleEnum.ADMIN) {
        const withoutMe = storedAdmins.filter(
          (user) => user.iabsId !== me?.iabsId
        );
        setAdmins(withoutMe);
      } else if (storedUserInfo.role === RoleEnum.REPUBLIC_EMPLOYEE) {
        const admins = storedAdmins.filter(
          (user) => user.region === storedUserInfo.region
        );
        const withoutMe = admins.filter((user) => user.iabsId !== me?.iabsId);
        setAdmins(withoutMe);
      } else if (storedUserInfo.role === RoleEnum.REGION_BOSS) {
        const admins = storedAdmins.filter(
          (user) =>
            user.region === storedUserInfo.region &&
            user.role === RoleEnum.REGION_EMPLOYEE
        );
        const withoutMe = admins.filter((user) => user.iabsId !== me?.iabsId);
        setAdmins(withoutMe);
      } else if (storedUserInfo.role === RoleEnum.REGION_EMPLOYEE) {
        setAdmins([me]);
      }
    }
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
    setNewAdmin({
      iabsId: "",
      name: "",
      username: "",
      password: "",
      role: "",
      region: "",
    });
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) =>
    setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });

  const handleSave = () => {
    if (editMode) {
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) => {
          return admin.iabsId === newAdmin.iabsId ? newAdmin : admin;
        })
      );
      const updatedAdmins = admins.map((admin) => {
        return admin.iabsId === newAdmin.iabsId ? newAdmin : admin;
      });
      localStorage.setItem(
        StorageItemNameEnum.USERS,
        JSON.stringify([...updatedAdmins, userInfo])
      );
    } else {
      setAdmins([...admins, newAdmin]);
      localStorage.setItem(
        StorageItemNameEnum.USERS,
        JSON.stringify([...admins, newAdmin, userInfo])
      );
    }
    handleClose();
  };

  const handleEdit = (admin) => {
    setEditMode(true);
    setNewAdmin(admin);
    setOpen(true);
  };

  const handleDelete = (iabsId) => {
    const updatedAdmins = admins.filter((admin) => admin.iabsId !== iabsId);
    setAdmins(updatedAdmins);
    localStorage.setItem(
      StorageItemNameEnum.USERS,
      JSON.stringify([...updatedAdmins, userInfo])
    );
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
          {editMode ? "Edit Admin" : "Add New Admin"}
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
              readOnly: editMode, // Make iabsId read-only in edit mode
            }}
            // disabled={editMode}
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
          <TextField
            margin="dense"
            name="username"
            label="Username"
            type="text"
            fullWidth
            value={newAdmin.username}
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
            name="password"
            label="Password"
            type="text"
            fullWidth
            value={newAdmin.password}
            onChange={handleChange}
            InputLabelProps={{
              style: { color: "#003366" },
            }}
            InputProps={{
              style: { color: "#003366" },
            }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel sx={{ color: "#003366" }}>Role</InputLabel>
            <Select
              name="role"
              value={newAdmin.role}
              onChange={handleChange}
              displayEmpty
              sx={{ color: "#003366" }}
            >
              {Object.entries(RoleEnum).map(([key, value]) => (
                <MenuItem key={key} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel sx={{ color: "#003366" }}>Region</InputLabel>
            <Select
              name="region"
              value={newAdmin.region}
              onChange={handleChange}
              displayEmpty
              sx={{ color: "#003366" }}
            >
              {regions.map((region) => (
                <MenuItem key={region.id} value={region.id}>
                  {region.name}
                </MenuItem>
              ))}
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
