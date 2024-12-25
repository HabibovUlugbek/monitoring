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
import { RoleEnum, regions } from "constants.js";
import { getCookie } from "helper";
import { useNavigate } from "react-router-dom";
import {
  useGetAdminsQuery,
  useGetMeQuery,
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useUpdateAdminMutation,
} from "state/api";

const Admin = () => {
  const theme = useTheme();
  const [userInfo, setUserInfo] = useState({});
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    id: "",
    name: "",
    username: "",
    role: "",
    region: "",
    password: "",
  });

  const { data: adminsData, refetch } = useGetAdminsQuery();
  const [admins, setAdmins] = useState([]);
  const [createAdmin] = useCreateAdminMutation();
  const [deleteAdmin] = useDeleteAdminMutation();
  const [updateAdmin] = useUpdateAdminMutation();

  const { data: myInfo } = useGetMeQuery();

  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    const refreshToken = getCookie("refreshToken");
    if (!accessToken || !refreshToken) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (adminsData) {
      setAdmins(adminsData);
    }
  }, [adminsData]);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
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
                  marginRight: "8px",
                }}
                onClick={() => handleEdit(params.row)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(params.row.id)}
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
    if (myInfo) {
      setUserInfo(myInfo);
    }
  }, [myInfo]);

  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
    setNewAdmin({
      id: "",
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

  const handleSave = async () => {
    if (editMode) {
      await updateAdmin(newAdmin);
    } else {
      await createAdmin(newAdmin);
    }
    handleClose();
    refetch();
  };

  const handleEdit = (admin) => {
    setEditMode(true);
    setNewAdmin(admin);
    setOpen(true);
    refetch();
  };

  const handleDelete = async (id) => {
    await deleteAdmin(id);
    refetch();
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Box display="flex" justifyContent="space-between">
        <Header title="ADMINS" subtitle="Managing admins and list of admins" />
        <Box display="flex" alignItems="center">
          {userInfo.role === RoleEnum.REPUBLIC_BOSS ||
          userInfo.role === RoleEnum.REPUBLIC_EMPLOYEE ? (
            <Button
              variant="contained"
              onClick={handleOpen}
              sx={{ "&:hover": { color: "#ffffff" } }}
            >
              Add Admin
            </Button>
          ) : (
            <></>
          )}
        </Box>
      </Box>
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiButton-contained:hover": {
            color: "white",
          },
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            color: theme.palette.secondary[100],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: "#003366",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
            {
              outline: "none",
            },
          "& .MuiDataGrid-menuIconButton": {
            color: "#003366",
          },
          "& .MuiDataGrid-sortIcon": {
            color: "#003366",
          },
          "& .MuiTablePagination-actions .MuiIconButton-root": {
            color: "#003366",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: "#003366",
            borderTop: "none",
          },
          "& .MuiSelect-icon": {
            color: "#003366",
          },
          "& .MuiTablePagination-root": {
            color: "#003366",
          },
          "& .MuiDataGrid-footerContainer .MuiTablePagination-rootContainer": {
            color: theme.palette.secondary[100],
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: theme.palette.secondary[100] + " !important",
          },
        }}
      >
        <DataGrid
          loading={!admins}
          getRowId={(row) => row.id}
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
            name="id"
            label="ID"
            type="text"
            fullWidth
            value={newAdmin.id}
            onChange={handleChange}
            InputLabelProps={{
              style: { color: "#003366" },
            }}
            InputProps={{
              style: { color: "#003366" },
              readOnly: editMode,
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
            type="password"
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
