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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import CustomColumnMenu from "components/DataGridCustomColumnMenu";
import * as xlsx from "xlsx";
import { regions, RoleEnum, StorageItemNameEnum } from "constants.js";

const Loans = () => {
  const theme = useTheme();
  const [userInfo, setUserInfo] = useState({});
  const [loans, setLoans] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [regionUsers, setRegionUsers] = useState([]);

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
    setSelectedUser("");
  };

  const handleAssignUser = () => {
    const updatedLoans = loans.map((loan) =>
      loan.loanId === selectedLoanId
        ? { ...loan, responsible: selectedUser }
        : loan
    );
    setLoans(updatedLoans);
    localStorage.setItem(
      StorageItemNameEnum.LOANS,
      JSON.stringify(updatedLoans)
    );
    handleClose();
  };

  function findUsername(iabsId) {
    const user = regionUsers.find((user) => user.iabsId === iabsId);

    return user?.name || "Not defined";
  }

  const columns = [
    {
      field: "loanId",
      headerName: "Loan Id",
      flex: 0.3,
    },
    {
      field: "clientname",
      headerName: "Client Name",
      flex: 0.7,
      sortable: false,
    },
    {
      field: "region",
      headerName: "Region",
      flex: 0.2,
      valueGetter: (params) => {
        const region = regions.find((r) => r.id === params.value);
        return region ? region.name : "Not defined";
      },
    },
    {
      field: "dateLoan",
      headerName: "Given date",
      flex: 0.3,
    },
    {
      field: "dateDiff",
      headerName: "Days left",
      flex: 0.5,
    },
    {
      field: "responsible",
      headerName: "Responsible person",
      flex: 0.5,
      renderCell: (params) =>
        params.value ? (
          findUsername(params.value)
        ) : (
          // regionUsers.find((user) => user.iabsId === params.value)?.name
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
        ),
    },
  ];

  useEffect(() => {
    const fetchData = async (storedUserInfo) => {
      let storedLoan = localStorage.getItem(StorageItemNameEnum.LOANS);
      if (storedLoan) {
        storedLoan = JSON.parse(storedLoan);
        let myLoans = [];
        if (storedUserInfo.role === RoleEnum.ADMIN) {
          myLoans = storedLoan;
        } else if (
          storedUserInfo.role === RoleEnum.REPUBLIC_EMPLOYEE ||
          storedUserInfo.role === RoleEnum.REGION_BOSS
        ) {
          myLoans = storedLoan.filter(
            (loan) => loan.region === storedUserInfo.region
          );
        } else if (storedUserInfo.role === RoleEnum.REGION_EMPLOYEE) {
          myLoans = storedLoan.filter((loan) => {
            console.log(loan.responsible, storedUserInfo.iabsId);
            return loan.responsible == storedUserInfo.iabsId;
          });
        }
        setLoans(myLoans);
      } else {
        const response = await fetch(`./loan.xlsx`);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = xlsx.read(new Uint8Array(arrayBuffer), {
          type: "array",
        });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

        const formattedData = jsonData.map((data, index) => ({
          id: index,
          loanId: data[22],
          dateLoan: formatDate(data[8]),
          dateDiff: calculateDaysLeft(data[8]),
          clientname: data[3],
          region: data[0],
          responsible: null, // Assuming responsible person's name is in column 23 (adjust if needed)
        }));

        formattedData.shift();

        localStorage.setItem(
          StorageItemNameEnum.LOANS,
          JSON.stringify(formattedData)
        );

        const myLoans = formattedData.filter(
          (loan) => loan.region === userInfo.region
        );
        setLoans(myLoans);
      }
    };

    const storedUserInfo = JSON.parse(
      localStorage.getItem(StorageItemNameEnum.USER_INFO)
    );
    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
    }

    const storedUsers = JSON.parse(
      localStorage.getItem(StorageItemNameEnum.USERS)
    );
    if (storedUsers) {
      const usersInRegion = storedUsers.filter(
        (user) =>
          user.region === storedUserInfo.region &&
          user.role !== RoleEnum.REPUBLIC_EMPLOYEE
      );
      setRegionUsers(usersInRegion);
    }

    (async () => {
      try {
        await fetchData(storedUserInfo);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, []);

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="LOANS" subtitle="Track your Affiliate Sales Loans Here" />
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            color: theme.palette.secondary[100],
            borderBottom: "none",
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
        }}
      >
        <DataGrid
          loading={!loans}
          getRowId={(row) => row.id}
          rows={loans || []}
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
              {regionUsers.map((user) => (
                <MenuItem key={user.iabsId} value={user.iabsId}>
                  {user.name}
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
    </Box>
  );
};

export default Loans;
