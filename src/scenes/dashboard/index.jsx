import React, { useEffect, useState } from "react";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from "@mui/icons-material";
import { Box, Button, useTheme, useMediaQuery } from "@mui/material";
import OverviewChart from "components/OverviewChart";
import StatBox from "components/StatBox";
import LoanBarChart from "components/LoanBarChart";
import { StorageItemNameEnum, LoanStatusEnum } from "constants.js";

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "userId",
      headerName: "User ID",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      flex: 1,
    },
    {
      field: "products",
      headerName: "# of Products",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value.length,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
  ];

  const [loansCount, setLoansCount] = useState(0);
  const [checkedCount, setCheckedCount] = useState(0);
  const [checkedByRepublicCount, setCheckedByRepublicCount] = useState(0);
  const [outdated, setOutdated] = useState(0);
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(StorageItemNameEnum.LOANS));
    if (data) {
      setLoansCount(data.length);
      data.forEach((loan) => {
        if (
          [
            LoanStatusEnum.MAQSADLI,
            LoanStatusEnum.MAQSADSIZ,
            LoanStatusEnum.QISMAN_MAQSADLI,
            LoanStatusEnum.QISMAN_MAQSADSIZ,
          ].includes(loan.status)
        ) {
          setCheckedCount((prev) => prev + 1);
        }
        if (
          [LoanStatusEnum.SUCCESS, LoanStatusEnum.CANCELLED].includes(
            loan.status
          )
        ) {
          setCheckedByRepublicCount((prev) => prev + 1);
        }
        if (loan.status === LoanStatusEnum.OUTDATED) {
          setOutdated((prev) => prev + 1);
        }
      });
    }
  }, []);

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="MAIN" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Reports
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
          title="Total Loans"
          value={loansCount}
          increase="+14%"
          description="Since last month"
          icon={
            <Email
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="O`rganildi"
          value={checkedCount}
          increase="+21%"
          description="Since last month"
          icon={
            <PointOfSale
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
        >
          <OverviewChart view="sales" isDashboard={true} />
        </Box>
        <StatBox
          title="Ko`rib chiqildi"
          value={checkedByRepublicCount}
          increase="+5%"
          description="Since last month"
          icon={
            <PersonAdd
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Muddati o`tgan"
          value={outdated}
          increase="-13%"
          description="Since last month"
          icon={
            <Traffic
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
          <LoanBarChart />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
