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
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
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
  useGetLoanFilesQuery,
} from "state/api";
import { getCookie } from "helper";

const Loans = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [selectedLoanId, setSelectedLoanId] = useState(null);

  const { data: loansData, isLoading } = useGetLoansQuery();
  const { data: meData, refetch } = useGetMeQuery();
  const [assignLoan] = useAssignLoanMutation();
  const [approveLoan] = useApproveLoanMutation();
  const [rejectLoan] = useRejectLoanMutation();
  const [uploadFile] = useUploadFileMutation();
  const { data: fileData, refetch: refetchFiles } =
    useGetLoanFilesQuery(selectedLoanId);

  const [selectedLoanBhmCode, setSelectedLoanBhmCode] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: adminsData } = useGetAdminsQuery(selectedLoanBhmCode);

  const [open, setOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [reportUploadOpen, setReportUploadOpen] = useState(false);

  const [fileName, setFileName] = useState("");
  const [filePages, setFilePages] = useState("");
  const [fileComment, setFileComment] = useState("");

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
    setSelectedLoanBhmCode();
  };

  const handleAssignUser = () => {
    assignLoan({ loanId: selectedLoanId, userId: selectedUser });
    handleClose();
  };

  const handleUploadClose = () => {
    setUploadOpen(false);
    setSelectedLoanId(null);
    setReportUploadOpen(false);
  };

  const columns = [
    {
      field: "externalId",
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
        console.log(
          RoleEnum.REGION_CHECKER_EMPLOYEE === RoleEnum[meData?.role] &&
            isResponsible
        );
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
              onClick={() => {
                setSelectedLoanBhmCode(params.row.bhmCode);
                handleOpen(params.row.id);
              }}
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
          RoleEnum.REGION_CHECKER_EMPLOYEE === RoleEnum[meData?.role] &&
          isResponsible
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
                onClick={() => {
                  setReportUploadOpen(true);
                  setSelectedLoanId(params.row?.id);
                }}
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
        } else if (
          [RoleEnum.REPUBLIC_EMPLOYEE, RoleEnum.REGION_CHECKER_BOSS].includes(
            RoleEnum[meData?.role]
          ) &&
          isResponsible
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
                onClick={() => setReportUploadOpen(true)}
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
      setFileName(file.name);
    }
  };

  const handleFileSave = async () => {
    const fileInput = document.getElementById("file-upload");
    const file = fileInput.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file, file.name);

      try {
        await uploadFile({
          loanId: selectedLoanId,
          formData,
          name: fileName,
          pages: filePages,
          comment: fileComment,
        });

        refetchFiles();
      } catch (error) {
        console.error("File upload failed:", error);
      }
    }
  };

  const handleFilesApprove = () => {
    approveLoan(selectedLoanId);
    setSelectedLoanId(null);
    handleUploadClose();
  };

  const handleReportApprove = async () => {
    const fileInput = document.getElementById("file-upload");
    const file = fileInput.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file, file.name);

      await uploadFile({
        loanId: selectedLoanId,
        formData,
        name: fileName,
        pages: filePages,
        comment: fileComment,
      });
    }
    approveLoan(selectedLoanId);
    setFileName(null);
    setSelectedLoanId(null);
    handleUploadClose();
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
            color: "#003366",
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
            color: "#003366",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: "#003366 !important",
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
                adminsData?.map(
                  (admin) =>
                    admin?.bhmCode === selectedLoanBhmCode && (
                      <MenuItem key={admin.id} value={admin.id}>
                        {admin.name}
                      </MenuItem>
                    )
                )
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
        open={reportUploadOpen}
        onClose={handleUploadClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: "white", color: "#003366" }}>
          {`Upload Files for Loan ${selectedLoanId}`}
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
              InputLabelProps={{
                style: { color: "#003366" },
              }}
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
                height: "56px",
                margin: "5px 0",
                textTransform: "none",
                fontSize: "0.875rem",
              }}
            >
              Choose File
            </Button>
            {fileName && (
              <Typography
                // variant="body2"
                sx={{
                  color: "#003366",
                  marginTop: "10px",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                Selected file: {fileName}
              </Typography>
            )}
          </label>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "white" }}>
          <Button onClick={handleUploadClose} sx={{ color: "#003366" }}>
            Cancel
          </Button>
          <Button
            onClick={handleReportApprove}
            variant="contained"
            sx={{
              backgroundColor: "#003366",
              color: "white",
              "&:hover": { backgroundColor: "#002244" },
            }}
          >
            Approve
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
          {`Upload Files for Loan ${selectedLoanId}`}
        </DialogTitle>
        <DialogContent
          sx={{ backgroundColor: "white", color: "#003366", padding: "2rem" }}
        >
          <>
            {fileData?.length > 0 ? (
              <Table
                sx={{
                  backgroundColor: "white",
                  color: "#003366",
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#003366" }}>File Name</TableCell>
                    <TableCell sx={{ color: "#003366" }}>Pages</TableCell>
                    <TableCell sx={{ color: "#003366" }}>Uploader</TableCell>
                    <TableCell sx={{ color: "#003366" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fileData.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell sx={{ color: "#003366" }}>
                        {file.name}
                      </TableCell>
                      <TableCell sx={{ color: "#003366" }}>
                        {file.pages}
                      </TableCell>
                      <TableCell sx={{ color: "#003366" }}>
                        {file.admin.name}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="primary"
                          href={file.path}
                          target="_blank"
                          sx={{
                            backgroundColor: "#003366",
                            "&:hover": { backgroundColor: "#002244" },
                          }}
                        >
                          Download File
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <></>
            )}
          </>

          <Typography
            variant="h6"
            sx={{
              color: "#003366",
              marginTop: "1rem",
              justifyContent: "center",
              display: "flex",
            }}
          >
            Adding New File
          </Typography>
          <label
            htmlFor="file-upload"
            style={{ display: "block", marginTop: "20px" }}
          >
            <Box display={"flex"} alignItems={"center"} mt={2}>
              <TextField
                fullWidth
                margin="dense"
                label="Name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                sx={{
                  "& .MuiInputLabel-root": { color: "#003366" },
                  "& .MuiInputBase-root": { color: "#003366" },
                }}
                InputLabelProps={{
                  style: { color: "#003366" },
                }}
                InputProps={{
                  style: { color: "#003366", border: "1px solid #003366" },
                }}
              />
              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
                InputLabelProps={{
                  style: { color: "#003366" },
                }}
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
                  height: "56px",
                  margin: "5px 0",
                  textTransform: "none",
                  fontSize: "0.875rem",
                }}
              >
                Choose File
              </Button>
            </Box>
          </label>
          <TextField
            fullWidth
            margin="dense"
            label="Pages"
            type="number"
            value={filePages}
            onChange={(e) => setFilePages(e.target.value)}
            sx={{
              "& .MuiInputLabel-root": { color: "#003366" },
              "& .MuiInputBase-root": { color: "#003366" },
            }}
            InputLabelProps={{
              style: { color: "#003366" },
            }}
            InputProps={{
              style: { color: "#003366", border: "1px solid #003366" },
            }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Comment"
            multiline
            rows={4}
            value={fileComment}
            onChange={(e) => setFileComment(e.target.value)}
            sx={{
              "& .MuiInputLabel-root": { color: "#003366" },
              "& .MuiInputBase-root": { color: "#003366" },
            }}
            InputLabelProps={{
              style: { color: "#003366" },
            }}
            InputProps={{
              style: { color: "#003366", border: "1px solid #003366" },
            }}
          />
          <Button
            onClick={handleFileSave}
            variant="contained"
            sx={{
              backgroundColor: "#003366",
              color: "white",
              "&:hover": { backgroundColor: "#002244" },
            }}
          >
            Save Details
          </Button>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "white" }}>
          <Button onClick={handleUploadClose} sx={{ color: "#003366" }}>
            Cancel
          </Button>
          <Button
            onClick={handleFilesApprove}
            variant="contained"
            sx={{
              backgroundColor: "#003366",
              color: "white",
              "&:hover": { backgroundColor: "#002244" },
            }}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Loans;
