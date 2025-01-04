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
import { regions } from "constants.js";

const regionCodes = regions.reduce((acc, region) => {
  acc[region.id] = region.name;
  return acc;
}, {});

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
        >{`Approved: ${payload[2].value}`}</p>
      </div>
    );
  }

  return null;
};

const LoanBarChart = ({ info }) => {
  const [loanData, setLoanData] = useState([]);

  useEffect(() => {
    if (!info) return;

    const formattedData = info.map((reg) => ({
      region: regionCodes[reg.region],
      allLoans: reg.approved + reg.inProcess + reg.outdated + reg.rejected,
      inProcess: reg.inProcess,
      approved: reg.approved,
    }));

    setLoanData(formattedData);
  }, [info]);

  if (!info) {
    return <div style={{ color: "blue" }}>Loading data...</div>; // Display loading message while fetching data
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
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="allLoans" fill="#8884d8" name="All Loans" />
          <Bar dataKey="inProcess" fill="#82ca9d" name="In Process" />
          <Bar dataKey="approved" fill="#ffc658" name="Approved" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default LoanBarChart;
