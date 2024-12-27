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
import {
  LoanStatusEnum,
  regions,
  RoleEnum,
  StorageItemNameEnum,
} from "constants.js";

import { useNavigate } from "react-router-dom";
import {
  useGetLoansQuery,
  useAssignLoanMutation,
  useGetAdminsQuery,
  useGetMeQuery,
} from "state/api";
import { getCookie } from "helper";

const Loans = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { data: loansData } = useGetLoansQuery();
  const { data: adminsData } = useGetAdminsQuery();
  const { data: meData, refetch } = useGetMeQuery();
  const [assignLoan] = useAssignLoanMutation();

  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [open, setOpen] = useState(false);
  const [checkOpen, setCheckOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [fileData, setFileData] = useState(null);

  const formatDate = (excelSerialDate) => {
    const dateObject = new Date((excelSerialDate - 25569) * 86400 * 1000);
    const formattedDate = dateObject.toLocaleDateString("en-GB");
    return formattedDate;
  };

  const calculateDaysLeft = (excelSerialDate) => {
    const dateObject = new Date((excelSerialDate - 25569) * 86400 * 1000);
    const currentDate = new Date();
    const daysLeft = Math.floor(
      (dateObject - currentDate) / (1000 * 60 * 60 * 24)
    );
    return daysLeft + 30;
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

  const handleAssignUser = (id) => {
    assignLoan({ loanId: selectedLoanId, userId: selectedUser.id });
    handleClose();
  };

  const handleUploadOpen = (loanId) => {
    setSelectedLoanId(loanId);
    setUploadOpen(true);
  };

  const handleUploadClose = () => {
    console.log("done");
    setUploadOpen(false);
    setSelectedLoanId(null);
    setSelectedStatus("");
    setFileData(null);
    setSelectedFileName("");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
      const base64Data = reader.result;
      setFileData(base64Data);
    };

    if (file) {
      setSelectedFileName(file.name);
      reader.readAsDataURL(file);
    }
  };

  const handleFileSave = () => {
    alert("Please select a status and upload a file!");
  };

  const handleFileDownload = (loanId) => {
    const storedFiles = JSON.parse(
      localStorage.getItem(StorageItemNameEnum.LOAN_FILES) || "[]"
    );
    const file = storedFiles.find((file) => file.loanId === loanId);

    if (file) {
      const link = document.createElement("a");
      link.href = file.data;
      link.download = `loan_${loanId}.pdf`;
      link.click();
    } else {
      alert("No file found to download!");
    }
  };

  const handleStatusChange = (loanId, newStatus) => {
    alert("Please select a status and upload a file!");
  };

  const handleCheckOpen = (loanId) => {
    setSelectedLoanId(loanId);
    setCheckOpen(true);
  };

  const handleCheckClose = () => {
    setCheckOpen(false);
    setSelectedLoanId(null);
  };

  const handleCheckAction = (action) => {
    if (action === "Download") {
      handleFileDownload(selectedLoanId);
    } else if (action === "Success") {
      handleStatusChange(selectedLoanId, LoanStatusEnum.SUCCESS);
    } else if (action === "Cancel") {
      handleStatusChange(selectedLoanId, LoanStatusEnum.CANCELLED);
    }
    handleCheckClose();
  };

  const columns = [
    {
      field: "loanId",
      headerName: "Loan Id",
      flex: 0.3,
    },
    {
      field: "clientname",
      headerName: "Client Name",
      flex: 1,
      sortable: false,
    },
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
      field: "dateLoan",
      headerName: "Given date",
      flex: 0.5,
    },
    {
      field: "dateDiff",
      headerName: "Days left",
      flex: 0.3,
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   flex: 0.5,
    //   valueGetter: (params) => {
    //     if (
    //       [
    //         LoanStatusEnum.MAQSADLI,
    //         LoanStatusEnum.MAQSADSIZ,
    //         LoanStatusEnum.QISMAN_MAQSADLI,
    //         LoanStatusEnum.QISMAN_MAQSADSIZ,
    //       ].includes(params.value) &&
    //       userInfo.role !== RoleEnum.REPUBLIC_EMPLOYEE
    //     ) {
    //       return "Tekshirilmoqda";
    //     } else return params.value;
    //   },
    // },
    {
      field: "responsible",
      headerName: "Responsible person",
      flex: 0.5,
      renderCell: (params) => {
        if (params.value) {
          return params.value;
        }
        if (RoleEnum.REGION_BOSS !== RoleEnum[meData.role]) {
          return "Nobody";
        } else {
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
              onClick={() => handleOpen(params.row.loanId)}
            >
              Assign
            </Button>
          );
        }
      },
    },
    {
      field: "control",
      headerName: "Control",
      flex: 0.5,
      renderCell: (params) => {
        // if (userInfo.role === RoleEnum.REPUBLIC_EMPLOYEE) {
        //   if (
        //     [
        //       LoanStatusEnum.MAQSADLI,
        //       LoanStatusEnum.MAQSADSIZ,
        //       LoanStatusEnum.QISMAN_MAQSADLI,
        //       LoanStatusEnum.QISMAN_MAQSADSIZ,
        //     ].includes(params.row.status)
        //   ) {
        //     return (
        //       <>
        //         <Button
        //           variant="contained"
        //           sx={{
        //             backgroundColor: "#003366",
        //             color: "white",
        //             "&:hover": {
        //               backgroundColor: "#002244",
        //             },
        //           }}
        //           onClick={() => handleCheckOpen(params.row.loanId)}
        //         >
        //           Tekshiruv
        //         </Button>
        //       </>
        //     );
        //   } else if (
        //     [LoanStatusEnum.SUCCESS, LoanStatusEnum.CANCELLED].includes(
        //       params.row.status
        //     )
        //   ) {
        //     return "Tekshirilgan";
        //   } else {
        //     return "Tekshirishga tayyor emas";
        //   }
        // } else if (userInfo.role === RoleEnum.REGION_EMPLOYEE) {
        //   if (params.row.status === LoanStatusEnum.PENDING) {
        //     return (
        //       <Button
        //         variant="contained"
        //         sx={{
        //           backgroundColor: "#003366",
        //           color: "white",
        //           "&:hover": {
        //             backgroundColor: "#002244",
        //           },
        //         }}
        //         onClick={() => handleUploadOpen(params.row.loanId)}
        //       >
        //         Upload
        //       </Button>
        //     );
        //   } else if (
        //     [
        //       LoanStatusEnum.MAQSADLI,
        //       LoanStatusEnum.MAQSADSIZ,
        //       LoanStatusEnum.QISMAN_MAQSADLI,
        //       LoanStatusEnum.QISMAN_MAQSADSIZ,
        //     ].includes(params.row.status)
        //   ) {
        //     return "Siz tekshira olmaysiz";
        //   } else if (LoanStatusEnum.SUCCESS === params.row.status) {
        //     return "Qabul qilindi";
        //   } else if (LoanStatusEnum.CANCELLED === params.row.status) {
        //     return "Qabul qilinmadi";
        //   } else {
        //     return "Muddati o'tdi";
        //   }
        // } else if (userInfo.role === RoleEnum.REGION_BOSS) {
        //   if (
        //     params.row.responsible === userInfo.iabsId &&
        //     params.row.status === LoanStatusEnum.PENDING
        //   ) {
        //     return (
        //       <Button
        //         variant="contained"
        //         sx={{
        //           backgroundColor: "#003366",
        //           color: "white",
        //           "&:hover": {
        //             backgroundColor: "#002244",
        //           },
        //         }}
        //         onClick={() => handleUploadOpen(params.row.loanId)}
        //       >
        //         Upload
        //       </Button>
        //     );
        //   } else if (
        //     [
        //       LoanStatusEnum.MAQSADLI,
        //       LoanStatusEnum.MAQSADSIZ,
        //       LoanStatusEnum.QISMAN_MAQSADLI,
        //       LoanStatusEnum.QISMAN_MAQSADSIZ,
        //     ].includes(params.row.status)
        //   ) {
        //     return "Siz tekshira olmaysiz";
        //   } else if (LoanStatusEnum.SUCCESS === params.row.status) {
        //     return "Qabul qilindi";
        //   } else if (LoanStatusEnum.CANCELLED === params.row.status) {
        //     return "Qabul qilinmadi";
        //   } else if (LoanStatusEnum.OUTDATED === params.row.status) {
        //     return "Muddati o'tdi";
        //   } else if (
        //     params.row.status === LoanStatusEnum.PENDING &&
        //     !params.row.responsible
        //   ) {
        //     return "Biriktirilmoqda";
        //   } else if (
        //     params.row.status === LoanStatusEnum.PENDING &&
        //     params.row.responsible
        //   ) {
        //     return "Biriktirilgan";
        //   } else {
        //     return "Siz tekshira olmaysiz";
        //   }
        // } else {
        //   return "You can't change";
        // }
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
          loading={false || !loansData.length}
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
                Select user
              </MenuItem>
              {adminsData.map((admin) => (
                <MenuItem key={admin.id} value={admin.id}>
                  {admin.name}
                </MenuItem>
              ))}
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
          <FormControl fullWidth margin="dense">
            <InputLabel sx={{ color: "#003366" }}>Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              sx={{ color: "#003366" }}
            >
              <MenuItem value={LoanStatusEnum.MAQSADLI}>Maqsadli</MenuItem>
              <MenuItem value={LoanStatusEnum.MAQSADSIZ}>Maqsadsiz</MenuItem>
              <MenuItem value={LoanStatusEnum.QISMAN_MAQSADLI}>
                Qisman Maqsadli
              </MenuItem>
              <MenuItem value={LoanStatusEnum.QISMAN_MAQSADSIZ}>
                Qisman Maqsadsiz
              </MenuItem>
            </Select>
          </FormControl>
          <label
            htmlFor="file-upload"
            style={{ display: "block", marginTop: "20px" }}
          >
            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
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

      {/* Modal for "Tekshiruv" */}
      <Dialog
        open={checkOpen}
        onClose={handleCheckClose}
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
        >{`Tekshiruv for loan ${selectedLoanId}`}</DialogTitle>
        <DialogContent
          sx={{
            margin: "2rem",
            backgroundColor: "white",
            textAlign: "center",
            display: "flex",

            justifyContent: "space-between",
          }}
        >
          <>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#003366",
                color: "white",
                "&:hover": {
                  backgroundColor: "#002244",
                },
                mr: 1,
              }}
              onClick={() => handleCheckAction("Download")}
            >
              Download
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "green",
                color: "white",

                mr: 1,
              }}
              onClick={() => handleCheckAction("Success")}
            >
              Success
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "red",
                color: "white",
              }}
              onClick={() => handleCheckAction("Cancel")}
            >
              Cancel
            </Button>
          </>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Loans;
