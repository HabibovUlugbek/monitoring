import React, { useEffect, useState } from "react";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import {
  DownloadOutlined,
  Home,
  PendingActions,
  CheckCircle,
  Refresh,
} from "@mui/icons-material";
import {
  Box,
  Button,
  useTheme,
  useMediaQuery,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import StatBox from "components/StatBox";
import LoanBarChart from "components/LoanBarChart";
import { regions, RoleEnum } from "constants.js";
import { getCookie } from "helper";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import {
  useGetAdminStatsQuery,
  useGetLoanStatsQuery,
  useGetMeQuery,
} from "state/api";

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  const { isLoading, data: statsData } = useGetAdminStatsQuery({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    region: selectedRegion || undefined,
  });

  const { isLoading: loading, data: loanStats } = useGetLoanStatsQuery();

  const { data: meData } = useGetMeQuery();

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    const refreshToken = getCookie("refreshToken");
    if (!accessToken || !refreshToken) {
      navigate("/login");
    }
  }, [navigate]);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "region",
      headerName: "Region",
      flex: 0.7,
      valueGetter: (params) => {
        const region = regions.find((r) => r.id === params.value);
        return region ? region.name : "Not defined";
      },
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.7,
      valueGetter: (params) => RoleEnum[params.value],
    },
    {
      field: "inProcess",
      headerName: "In Process",
      flex: 0.4,
      valueGetter: (params) => params.row.stats.inProcess,
    },
    {
      field: "rejected",
      headerName: "Rejected",
      flex: 0.4,
      valueGetter: (params) => params.row.stats.rejected,
    },
    {
      field: "outdated",
      headerName: "Outdated",
      flex: 0.4,
      valueGetter: (params) => params.row.stats.outdated,
    },
    {
      field: "approved",
      headerName: "Approved",
      flex: 0.4,
      valueGetter: (params) => params.row.stats.approved,
    },
  ];

  const [loansCount, setLoansCount] = useState(0);
  const [inProcess, setInProcess] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);

  useEffect(() => {
    if (loanStats) {
      let totalLoans = 0;
      let totalInProcess = 0;
      let totalRejected = 0;
      let totalOutdated = 0;
      let totalApproved = 0;

      loanStats.forEach((regStats) => {
        totalInProcess += regStats.inProcess;
        totalRejected += regStats.rejected;
        totalOutdated += regStats.outdated;
        totalApproved += regStats.approved;
        totalLoans +=
          totalApproved + totalInProcess + totalOutdated + totalRejected;
      });

      setLoansCount(totalLoans);
      setInProcess(totalInProcess);
      setRejectedCount(totalRejected);
      setApprovedCount(totalApproved);
    }
  }, [loanStats, loading]);

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="MAIN" subtitle="Welcome to your dashboard" />
        <Box display="flex" gap="1rem" alignItems="center" flexWrap="wrap">
          {RoleEnum[meData?.role] !== RoleEnum.REPUBLIC_EMPLOYEE && (
            <FormControl margin="dense" sx={{ minWidth: 200 }}>
              <InputLabel style={{ color: "#003366" }}>Region</InputLabel>
              <Select
                name="region"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                style={{
                  color: "#003366",
                  border: "1px solid #003366",
                }}
              >
                {regions.map((region) => (
                  <MenuItem key={region.id} value={region.id}>
                    {region.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{
              style: { color: "#003366" },
              shrink: true,
            }}
            InputProps={{
              style: { color: "#003366", border: "1px solid #003366" },
            }}
            onChange={(e) => setStartDate(e.target.value)}
            sx={{
              backgroundColor: theme.palette.background.default,
              borderRadius: "4px",
            }}
          />
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{
              style: { color: "#003366" },
              shrink: true,
            }}
            InputProps={{
              style: { color: "#003366", border: "1px solid #003366" },
            }}
            onChange={(e) => setEndDate(e.target.value)}
            sx={{
              backgroundColor: theme.palette.background.default,
              borderRadius: "4px",
            }}
          />

          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              textTransform: "none",
              "&:hover": {
                outline: `2px solid ${theme.palette.secondary.main}`,
                color: theme.palette.secondary.main,
              },
            }}
          >
            <DownloadOutlined />
          </Button>
        </Box>
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        <StatBox
          title="Jami Kreditlar"
          value={loansCount}
          increase="+14%"
          description="Since last month"
          icon={
            <Home
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Tekshirilmoqda"
          value={inProcess}
          increase="+21%"
          description="Since last month"
          icon={
            <PendingActions
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
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
              color: theme.palette.secondary[100],
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
            "& .MuiDataGrid-sortIcon": {
              color: theme.palette.secondary[100],
            },
            "& .MuiDataGrid-menuIconButton": {
              color: theme.palette.secondary[100],
            },
            "& .MuiTablePagination-actions .MuiIconButton-root": {
              color: theme.palette.secondary[100],
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            "& .MuiSelect-icon": {
              color: theme.palette.secondary[100],
            },
            "& .MuiTablePagination-root": {
              color: theme.palette.secondary[100],
            },
            "& .MuiDataGrid-footerContainer .MuiTablePagination-rootContainer":
              {
                color: theme.palette.secondary[100],
              },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: theme.palette.secondary[100] + " !important",
            },
          }}
        >
          {
            <DataGrid
              loading={isLoading || !statsData?.length}
              getRowId={(row) => row.id}
              rows={statsData || []}
              columns={columns}
              autoHeight
            />
          }
        </Box>
        <StatBox
          title="Qabul qilindi"
          value={approvedCount}
          increase="+5%"
          description="Since last month"
          icon={
            <CheckCircle
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Rad etilgan"
          value={rejectedCount}
          increase="-13%"
          description="Since last month"
          icon={
            <Refresh
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        {/* ROW 2 */}
        <Box
          gridColumn="span 12"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "5rem",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.background.alt,
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
          <LoanBarChart info={loanStats} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
