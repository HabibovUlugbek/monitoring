import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  Paper,
} from "@mui/material";

import { useGetLoanQuery } from "state/api";

const LoanDetailsPage = () => {
  const { loanId } = useParams();
  const [loanInfo, setLoanInfo] = useState(null);

  const { data, error, isLoading } = useGetLoanQuery(loanId);

  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (data) {
      setLoanInfo(data);
    }
    console.log(data);
  }, [data]);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading loan details</Typography>;

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const response = await fetch(`/api/loans/${loanId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      });

      if (response.ok) {
        const message = await response.json();
        setNewMessage("");
      }
    }
  };

  return (
    <Box display="flex" flexDirection={{ xs: "column", md: "row" }} p={2}>
      {/* Left Section */}
      <Box flex={3} p={2}>
        {/* Loan Info */}
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" color="#003366">
            Loan Information
          </Typography>
          {loanInfo ? (
            <Box>
              <Typography>
                <strong>ID:</strong> {loanInfo.id}
              </Typography>
              <Typography>
                <strong>Status:</strong> {loanInfo.status}
              </Typography>
              <Typography>
                <strong>Amount:</strong> {loanInfo.amount}
              </Typography>
              <Typography>
                <strong>Due Date:</strong> {loanInfo.dueDate}
              </Typography>
            </Box>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </Paper>

        {/* History Section */}
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" color="#003366">
            History
          </Typography>
          <List>
            {loanInfo?.history.map((data) => (
              <ListItem key={data.id}>
                <Typography>{data.status}</Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Right Section */}
      <Box flex={2} p={2}>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" color="#003366">
            Chat
          </Typography>

          {/* Messages */}
          <Box flex={1} overflow="auto" mb={2}>
            {loanInfo?.messages.map((msg, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  {msg.sender}:
                </Typography>
                <Typography>{msg.content}</Typography>
              </Box>
            ))}
          </Box>

          {/* Input Section */}
          <Divider sx={{ my: 2 }} />
          <Box display="flex">
            <TextField
              fullWidth
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              sx={{ mr: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              sx={{ backgroundColor: "#003366" }}
            >
              Send
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoanDetailsPage;
