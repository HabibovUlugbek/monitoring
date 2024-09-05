import React from "react";
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

const data = [
  { region: "Toshkent", allLoans: 1032, inProcess: 800, finished: 600 },
  { region: "Jizzax", allLoans: 738, inProcess: 500, finished: 300 },
  { region: "Samarqand", allLoans: 659, inProcess: 400, finished: 200 },
  { region: "Surxondaryo", allLoans: 452, inProcess: 350, finished: 220 },
  { region: "Farg'ona", allLoans: 395, inProcess: 280, finished: 180 },
  { region: "Buxoro", allLoans: 182, inProcess: 140, finished: 90 },
  // Add more regions as needed
];

const LoanBarChart = () => {
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
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="region" />
          <YAxis />
          <Tooltip />
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
