import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography } from "@mui/material";
import { LoanStatusEnum, regions, StorageItemNameEnum } from "constants.js";
import * as xlsx from "xlsx";

// Statuses for in-process and finished loans
const inProcessStatuses = [
  LoanStatusEnum.PENDING,
  LoanStatusEnum.MAQSADLI,
  LoanStatusEnum.MAQSADSIZ,
  LoanStatusEnum.QISMAN_MAQSADLI,
  LoanStatusEnum.QISMAN_MAQSADSIZ,
];
const finishedStatuses = [LoanStatusEnum.CANCELLED, LoanStatusEnum.SUCCESS];

// Region codes for the loans
const regionCodes = regions.reduce((acc, region) => {
  acc[region.id] = region.name;
  return acc;
}, {});

const formatDate = (excelSerialDate) => {
  const dateObject = new Date((excelSerialDate - 25569) * 86400 * 1000);
  return dateObject.toLocaleDateString("en-GB");
};

const calculateDaysLeft = (excelSerialDate) => {
  const dateObject = new Date((excelSerialDate - 25569) * 86400 * 1000);
  const currentDate = new Date();
  const daysLeft = Math.floor(
    (dateObject - currentDate) / (1000 * 60 * 60 * 24)
  );
  return daysLeft + 30;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "10px",
          color: "#333",
        }}
      >
        <p
          className="label"
          style={{
            fontWeight: "bold",
          }}
        >{`Region: ${label}`}</p>
        <p
          style={{
            color: "#8884d8",
          }}
        >{`All Loans: ${payload[0].value}`}</p>
        <p
          style={{
            color: "#82ca9d",
          }}
        >{`In Process: ${payload[1].value}`}</p>
        <p
          style={{
            color: "#ffc658",
          }}
        >{`Finished: ${payload[2].value}`}</p>
      </div>
    );
  }

  return null;
};

const LoanBarChart = () => {
  const [loanData, setLoanData] = useState([]);
  const [loading, setLoading] = useState(true); // To manage loading state

  useEffect(() => {
    const fetchData = async () => {
      let storedLoan = localStorage.getItem(StorageItemNameEnum.LOANS);

      if (!storedLoan || JSON.parse(storedLoan).length === 0) {
        // If no data in localStorage, fetch from Excel
        const response = await fetch("./loan.xlsx");
        const arrayBuffer = await response.arrayBuffer();
        const workbook = xlsx.read(new Uint8Array(arrayBuffer), {
          type: "array",
        });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

        // Map Excel data to loan structure
        storedLoan = jsonData.map((data, index) => ({
          id: index,
          loanId: data[22],
          dateLoan: formatDate(data[8]),
          dateDiff: calculateDaysLeft(data[8]),
          clientname: data[3],
          region: data[0],
          status:
            calculateDaysLeft(data[8]) > 0
              ? LoanStatusEnum.PENDING
              : LoanStatusEnum.OUTDATED,
          responsible: null, // Assuming responsible person's name is in column 23
        }));

        storedLoan.shift(); // Remove header row if present
        localStorage.setItem(
          StorageItemNameEnum.LOANS,
          JSON.stringify(storedLoan)
        );
      } else {
        storedLoan = JSON.parse(storedLoan);
      }

      return storedLoan;
    };

    const processLoanData = (storedLoans) => {
      const regionData = {};

      // Initialize region data with zeros
      Object.keys(regionCodes).forEach((code) => {
        regionData[regionCodes[code]] = {
          allLoans: 0,
          inProcess: 0,
          finished: 0,
        };
      });

      // Process the loans and categorize them
      storedLoans.forEach((loan) => {
        const regionName = regionCodes[loan.region];
        if (regionName) {
          regionData[regionName].allLoans += 1;

          if (inProcessStatuses.includes(loan.status)) {
            regionData[regionName].inProcess += 1;
          } else if (finishedStatuses.includes(loan.status)) {
            regionData[regionName].finished += 1;
          }
        }
      });

      // Convert the regionData object into an array for the chart
      const processedData = Object.keys(regionData).map((region) => ({
        region,
        allLoans: regionData[region].allLoans,
        inProcess: regionData[region].inProcess,
        finished: regionData[region].finished,
      }));

      setLoanData(processedData);
      setLoading(false); // Data is loaded
    };

    fetchData().then((storedLoans) => {
      processLoanData(storedLoans);
    });
  }, []);

  if (loading) {
    return <div>Loading data...</div>; // Display loading message while fetching data
  }

  return (
    <Box
      mt="40px"
      p="20px"
      bgcolor="white"
      borderRadius="8px"
      boxShadow="0 2px 10px rgba(0, 0, 0, 0.1)"
    >
      <Typography variant="h5" mb="20px" textAlign="center" fontWeight="bold">
        Loans Overview by Region
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={loanData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="region" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} /> {/* Add custom tooltip */}
          <Legend />
          <Bar dataKey="allLoans" fill="#8884d8" name="All Loans" />
          <Bar dataKey="inProcess" fill="#82ca9d" name="In Process" />
          <Bar dataKey="finished" fill="#ffc658" name="Finished" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default LoanBarChart;
