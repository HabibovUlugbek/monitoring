import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import CustomColumnMenu from "components/DataGridCustomColumnMenu";
import * as xlsx from "xlsx";

const Performance = () => {
  const theme = useTheme();
  const [loans, setLoans] = useState([]);

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
  const columns = [
    {
      field: "loanId",
      headerName: "Loan Id",
      flex: 1,
    },
    {
      field: "dateLoan",
      headerName: "Given date",
      flex: 1,
    },
    {
      field: "dateDiff",
      headerName: "Days left",
      flex: 1,
    },
    {
      field: "clientname",
      headerName: "Client Name",
      flex: 0.5,
      sortable: false,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`./data.xlsx`);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = xlsx.read(new Uint8Array(arrayBuffer), {
        type: "array",
      });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
      console.log(jsonData);

      // // Assuming the first row is the header, process the rest
      // const formattedData = jsonData.slice(1).map((row, index) => ({
      //   _id: index,
      //   userId: row[0],
      //   createdAt: row[1],
      //   products: row[2] ? row[2].split(",") : [],
      //   cost: row[3],
      // }));

      const formattedData = jsonData.map((data) => ({
        loanId: data[25],
        dateLoan: formatDate(data[10]),
        dateDiff: calculateDaysLeft(data[10]),
        clientname: data[4],
      }));

      setLoans(formattedData);
    };

    fetchData();
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
          getRowId={(row) => row.loanId}
          rows={loans}
          columns={columns}
          components={{
            ColumnMenu: CustomColumnMenu,
          }}
        />
      </Box>
    </Box>
  );
};

export default Performance;
