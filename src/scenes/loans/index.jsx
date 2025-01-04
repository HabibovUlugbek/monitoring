import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import CustomColumnMenu from "components/DataGridCustomColumnMenu";
import { regions, RoleEnum } from "constants.js";
import { useNavigate } from "react-router-dom";
import {
  useGetLoansQuery,
  useAssignLoanMutation,
  useGetAdminsQuery,
  useGetMeQuery,
  useApproveLoanMutation,
  useRejectLoanMutation,
  useUploadFileMutation,
} from "state/api";
import { getCookie } from "helper";

const Loans = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { data: loansData, isLoading } = useGetLoansQuery();
  const { data: adminsData } = useGetAdminsQuery();
  const { data: meData, refetch } = useGetMeQuery();
  const [assignLoan] = useAssignLoanMutation();
  const [approveLoan] = useApproveLoanMutation();
  const [rejectLoan] = useRejectLoanMutation();
  const [uploadFile] = useUploadFileMutation();

  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [open, setOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  const formatDate = (date) => {
    const formattedDate = new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return formattedDate;
  };

  const handleOpen = (loanId) => {
    setSelectedLoanId(loanId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedLoanId(null);
    setSelectedUser(null);
  };

  const handleAssignUser = () => {
    assignLoan({ loanId: selectedLoanId, userId: selectedUser });
    handleClose();
  };

  const handleUploadClose = () => {
    setUploadOpen(false);
    setSelectedLoanId(null);
    setSelectedFileName("");
  };

  const columns = [
    {
      field: "id",
      headerName: "Loan Id",
      flex: 0.5,
      renderCell: (params) => (
        <Typography
          sx={{
            color: "#003366",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => navigate(`/loan/${params.row.id}`)}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "borrower",
      headerName: "Client Name",
      flex: 0.8,
      sortable: false,
    },
    {
      field: "codeRegion",
      headerName: "Region",
      flex: 0.4,
      valueGetter: (params) => {
        const region = regions.find((r) => r.id === params.value);
        return region ? region.name : "Not defined";
      },
    },
    {
      field: "issuedAt",
      headerName: "Given date",
      flex: 0.5,
      valueGetter: (params) => {
        return formatDate(params.value);
      },
    },
    {
      field: "responsible",
      headerName: "Responsible person",
      flex: 0.5,
      renderCell: (params) => {
        return params.row?.history[0]?.assignee.name;
      },
    },
    {
      field: "control",
      headerName: "Control",
      flex: 0.5,
      renderCell: (params) => {
        const isResponsible = params.row?.history[0]?.assigneeId === meData?.id;
        if (RoleEnum.REGION_BOSS === RoleEnum[meData?.role] && isResponsible) {
          return (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#003366",
                color: "white",
                "&:hover": {
                  backgroundColor: "#002244",
                },
              }}
              onClick={() => handleOpen(params.row.id)}
            >
              Bo'lib berish
            </Button>
          );
        } else if (
          RoleEnum.REGION_EMPLOYEE === RoleEnum[meData?.role] &&
          isResponsible
        ) {
          return (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#003366",
                color: "white",
                "&:hover": {
                  backgroundColor: "#002244",
                },
              }}
              onClick={() => {
                setUploadOpen(true);
                setSelectedLoanId(params.row?.id);
              }}
            >
              Ma'lumot yuklash
            </Button>
          );
        } else if (RoleEnum.REPUBLIC_BOSS === RoleEnum[meData?.role]) {
          return "Sizda huquq yo'q";
        } else if (
          [
            RoleEnum.REPUBLIC_EMPLOYEE,
            RoleEnum.REGION_CHECKER_EMPLOYEE,
            RoleEnum.REGION_CHECKER_BOSS,
          ].includes(RoleEnum[meData?.role] && isResponsible)
        ) {
          return (
            <>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "green",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "darkgreen",
                  },
                  mr: 1,
                }}
                onClick={() => approveLoan({ loanId: params.row.id })}
              >
                Qabul qilish
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "red",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "darkred",
                  },
                }}
                onClick={() => rejectLoan({ loanId: params.row.id })}
              >
                Rad qilish
              </Button>
            </>
          );
        } else {
          return "Sizda huquq yo'q";
        }
      },
    },
  ];

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    const refreshToken = getCookie("refreshToken");
    if (!accessToken || !refreshToken) {
      navigate("/login");
    }
    if (!meData) {
      refetch();
    }
  }, [navigate, meData, refetch]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  const handleFileSave = () => {
    const fileInput = document.getElementById("file-upload");
    const file = fileInput.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file, file.name);

      uploadFile({ loanId: selectedLoanId, formData });

      setSelectedLoanId(null);

      handleUploadClose();
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Loans" />
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
            fontWeight: "bold", // Bold header text
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
            {
              outline: "none",
            },
          "& .MuiDataGrid-sortIcon": {
            color: "#003366", // Sorting arrow color
          },
          "& .MuiDataGrid-menuIconButton": {
            color: "#003366", // Color for 3-dot menu icon in column headers
          },
          "& .MuiTablePagination-actions .MuiIconButton-root": {
            color: "#003366", // Change color of pagination icons
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: "#003366",
            borderTop: "none",
          },
          "& .MuiSelect-icon": {
            color: "#003366", // Color of dropdown icon for changing page number
          },
          "& .MuiTablePagination-root": {
            color: "#003366", // Footer pagination text color
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
          loading={isLoading || !loansData?.length}
          getRowId={(row) => row.id}
          rows={loansData || []}
          columns={columns}
          components={{
            ColumnMenu: CustomColumnMenu,
          }}
        />
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "white",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#003366",
            color: "white",
            textAlign: "center",
          }}
        >
          {`Select Responsible Person for loan ${selectedLoanId}`}
        </DialogTitle>
        <DialogContent sx={{ padding: "2rem", backgroundColor: "white" }}>
          <FormControl fullWidth margin="dense">
            <InputLabel
              sx={{
                color: "#003366",
              }}
            >
              Select user
            </InputLabel>
            <Select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              displayEmpty
              sx={{
                "& .MuiSelect-select": {
                  color: "#003366",
                },
                "& .MuiSvgIcon-root": {
                  color: "#003366",
                },
              }}
            >
              <MenuItem value="" disabled>
                {adminsData?.length ? "Select user" : "No admins to select"}
              </MenuItem>
              {adminsData?.length ? (
                adminsData?.map((admin) => (
                  <MenuItem key={admin.id} value={admin.id}>
                    {admin.name}
                  </MenuItem>
                ))
              ) : (
                <></>
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: "white",
            padding: "1.5rem",
          }}
        >
          <Button
            onClick={handleClose}
            sx={{ color: "#003366", marginRight: "1rem" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssignUser}
            variant="contained"
            sx={{
              backgroundColor: "#003366",
              color: "white",
              "&:hover": { backgroundColor: "#002244" },
            }}
            disabled={!selectedUser}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={uploadOpen}
        onClose={handleUploadClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: "white", color: "#003366" }}>
          {`Upload File for Loan ${selectedLoanId}`}
        </DialogTitle>
        <DialogContent
          sx={{ backgroundColor: "white", color: "#003366", padding: "2rem" }}
        >
          <label
            htmlFor="file-upload"
            style={{ display: "block", marginTop: "20px" }}
          >
            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <Button
              variant="outlined"
              component="span"
              sx={{
                backgroundColor: "white",
                borderColor: "#003366",
                color: "#003366",
                "&:hover": {
                  borderColor: "#002244",
                  color: "#002244",
                  backgroundColor: "white",
                },
                padding: "10px 20px",
                textTransform: "none",
                fontSize: "0.875rem",
              }}
            >
              Choose File
            </Button>
          </label>
          {selectedFileName && (
            <Typography sx={{ marginTop: "10px", color: "#003366" }}>
              Selected File: {selectedFileName}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "white" }}>
          <Button onClick={handleUploadClose} sx={{ color: "#003366" }}>
            Cancel
          </Button>
          <Button
            onClick={handleFileSave}
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

export default Loans;
