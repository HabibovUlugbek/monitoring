import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import {
  useCreateAdminMutation,
  useDeleteAdminMutation,
  useUpdateAdminMutation,
} from "state/super-admin-api";
import { useGetAdminsForSuperAdminQuery } from "state/super-admin-api";
import { RoleEnum } from "constants";
import { regions } from "constants";
import { getCookie, deleteCookie } from "helper";
import { useNavigate } from "react-router-dom";

const SuperAdminDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formValues, setFormValues] = useState({
    username: "",
    name: "",
    region: "",
    role: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  const { data: admins = [], refetch } = useGetAdminsForSuperAdminQuery();
  const [createAdmin] = useCreateAdminMutation();
  const [deleteAdmin] = useDeleteAdminMutation();
  const [updateAdmin] = useUpdateAdminMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    const superAccessToken = getCookie("super-accessToken");
    const superRefreshToken = getCookie("super-refreshToken");

    if (!superAccessToken || !superRefreshToken) {
      navigate("/login");
    }
  }, [navigate]);

  const handleDelete = async (id) => {
    await deleteAdmin(id);
    refetch();
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setFormValues({
      username: admin.username,
      name: admin.name,
      region: admin.region,
      role: admin.role,
      password: "",
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingAdmin(null);
    setFormValues({
      username: "",
      name: "",
      region: "",
      role: "",
      password: "",
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const errors = {};
    if (!formValues.username) errors.username = "Username is required";
    if (!formValues.name) errors.name = "Name is required";
    if (!formValues.role) errors.role = "Role is required";
    if (!formValues.password && !editingAdmin)
      errors.password = "Password is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (editingAdmin) {
      await updateAdmin({ id: editingAdmin.id, ...formValues });
    } else {
      await createAdmin(formValues);
    }
    setIsDialogOpen(false);
    refetch();
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleLogout = () => {
    deleteCookie("super-accessToken");
    deleteCookie("super-refreshToken");

    navigate("/login");
  };

  return (
    <Container
      style={{
        backgroundColor: "#e8e8e8",
        minHeight: "100vh",
        padding: 0,
        maxWidth: "100%",
      }}
    >
      <Grid container spacing={0} style={{ height: "100vh" }}>
        <Grid
          item
          xs={12}
          md={3}
          style={{
            backgroundColor: "white",
            color: "#093475",
            minHeight: "100vh",
          }}
        >
          <Typography
            variant="h6"
            style={{
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "15px",
            }}
          >
            NAVBAR
          </Typography>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li
              style={{
                fontWeight: "bold",
                padding: "10px 0",
                color: "white",
                backgroundColor: "#093475",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div>Admins</div>
            </li>
          </ul>
        </Grid>
        <Grid item xs={12} md={9} style={{ padding: "20px" }}>
          <Paper
            style={{
              padding: "20px",
              backgroundColor: "white",
              border: "1px solid #093475",
            }}
          >
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography
                variant="h4"
                style={{ color: "#093475", fontWeight: "bold" }}
              >
                Admins
              </Typography>
              <div>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#093475",
                    color: "white",
                    marginRight: "10px",
                  }}
                  startIcon={<AddIcon />}
                  onClick={handleCreate}
                >
                  Create Admin
                </Button>
                <IconButton
                  onClick={handleLogout}
                  style={{ backgroundColor: "#093475", color: "white" }}
                >
                  <LogoutIcon />
                </IconButton>
              </div>
            </Grid>
            <Table style={{ marginTop: "20px", border: "1px solid #093475" }}>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "bold", color: "#093475" }}>
                    <TableSortLabel style={{ color: "#093475" }}>
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", color: "#093475" }}>
                    <TableSortLabel style={{ color: "#093475" }}>
                      Username
                    </TableSortLabel>
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", color: "#093475" }}>
                    <TableSortLabel style={{ color: "#093475" }}>
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", color: "#093475" }}>
                    <TableSortLabel style={{ color: "#093475" }}>
                      Region
                    </TableSortLabel>
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", color: "#093475" }}>
                    <TableSortLabel style={{ color: "#093475" }}>
                      Role
                    </TableSortLabel>
                  </TableCell>
                  <TableCell style={{ fontWeight: "bold", color: "#093475" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow
                    key={admin.id}
                    style={{ backgroundColor: "#e8f1ff" }}
                  >
                    <TableCell style={{ color: "#093475" }}>
                      {admin.id}
                    </TableCell>
                    <TableCell style={{ color: "#093475" }}>
                      {admin.username}
                    </TableCell>
                    <TableCell style={{ color: "#093475" }}>
                      {admin.name}
                    </TableCell>
                    <TableCell style={{ color: "#093475" }}>
                      {regions.find((r) => r.id === admin.region)?.name}
                    </TableCell>
                    <TableCell style={{ color: "#093475" }}>
                      {RoleEnum[admin.role]}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleEdit(admin)}
                        style={{
                          backgroundColor: "#093475",
                          color: "white",
                          marginRight: "10px",
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(admin.id)}
                        style={{ color: "#ff4d4f" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Dialog
              open={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle sx={{ backgroundColor: "white", color: "#003366" }}>
                {editingAdmin ? "Edit Admin" : "Add New Admin"}
              </DialogTitle>
              <DialogContent
                sx={{ backgroundColor: "white", color: "#003366" }}
              >
                <TextField
                  margin="dense"
                  name="name"
                  label="Name"
                  type="text"
                  fullWidth
                  value={formValues.name}
                  onChange={handleChange}
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                  InputLabelProps={{
                    style: { color: "#003366" },
                  }}
                  InputProps={{
                    style: { color: "#003366", border: "1px solid #003366" },
                  }}
                />
                <TextField
                  autoFocus
                  margin="dense"
                  name="username"
                  label="Username"
                  type="text"
                  fullWidth
                  value={formValues.username}
                  onChange={handleChange}
                  error={!!formErrors.username}
                  helperText={formErrors.username}
                  InputLabelProps={{
                    style: { color: "#003366" },
                  }}
                  InputProps={{
                    style: { color: "#003366", border: "1px solid #003366" },
                  }}
                />
                <TextField
                  margin="dense"
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  value={formValues.password}
                  onChange={handleChange}
                  error={!!formErrors.password}
                  helperText={formErrors.password}
                  InputLabelProps={{
                    style: { color: "#003366" },
                  }}
                  InputProps={{
                    style: { color: "#003366", border: "1px solid #003366" },
                  }}
                />
                <FormControl fullWidth margin="dense" error={!!formErrors.role}>
                  <InputLabel style={{ color: "#003366" }}>Role</InputLabel>
                  <Select
                    name="role"
                    value={formValues.role}
                    onChange={handleChange}
                    style={{ color: "#003366", border: "1px solid #003366" }}
                  >
                    {Object.entries(RoleEnum).map(([key, value]) => (
                      <MenuItem key={key} value={key}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.role && (
                    <Typography color="error" variant="caption">
                      {formErrors.role}
                    </Typography>
                  )}
                </FormControl>
                <FormControl fullWidth margin="dense">
                  <InputLabel style={{ color: "#003366" }}>Region</InputLabel>
                  <Select
                    name="region"
                    value={formValues.region}
                    onChange={handleChange}
                    style={{ color: "#003366", border: "1px solid #003366" }}
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
                <Button onClick={handleCancel} sx={{ color: "#003366" }}>
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
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SuperAdminDashboard;
