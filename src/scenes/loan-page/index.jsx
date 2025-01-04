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

import {
  useGetLoanQuery,
  useGetMeQuery,
  useSendMessageMutation,
} from "state/api";
import { regions } from "constants";

const LoanDetailsPage = () => {
  const { loanId } = useParams();
  const [loanInfo, setLoanInfo] = useState(null);

  const { data, error, isLoading, refetch } = useGetLoanQuery(loanId);
  const { data: meData } = useGetMeQuery();
  const [sendMessage] = useSendMessageMutation();

  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (data) {
      setLoanInfo(data);
    }
  }, [data]);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error loading loan details</Typography>;

  const handleSendMessage = async () => {
    await sendMessage({
      loanId,
      message: newMessage,
    });
    refetch();
  };

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      p={2}
      sx={{ backgroundColor: "#f0f0f0", minHeight: "100vh" }} // Grayish background
    >
      {/* Left Section */}
      <Box flex={3} p={2}>
        {/* Loan Info */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 2,
            backgroundColor: "#e0e0e0", // Lighter grayish background
            color: "#003366", // Text color
          }}
        >
          <Typography variant="h3" color="#003366">
            Loan Information
          </Typography>
          {loanInfo ? (
            <Box>
              <Typography>
                <strong>ID:</strong> {loanInfo.id}
              </Typography>
              <Typography>
                <strong>Borrower:</strong> {loanInfo.borrower}
              </Typography>
              <Typography>
                <strong>Region:</strong>{" "}
                {
                  regions.find((region) => region.id === loanInfo.codeRegion)
                    ?.name
                }
              </Typography>
              <Typography>
                <strong>Amount:</strong> {loanInfo.amount}
              </Typography>
              <Typography>
                <strong>Due Date:</strong>{" "}
                {new Date(loanInfo.dueDate).toLocaleDateString()}
              </Typography>
            </Box>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </Paper>

        {/* History Section */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            backgroundColor: "#e0e0e0", // Lighter grayish background
            color: "#003366", // Text color
          }}
        >
          <Typography variant="h3" color="#003366">
            History
          </Typography>
          <List>
            {loanInfo?.history.map((data) => (
              <ListItem key={data.id} sx={{ borderBottom: "1px solid #ccc" }}>
                <Box display="flex" flexDirection="column" width="100%">
                  <Typography>
                    {data.assignee.name} dagi vazifa {data.status} holatida.
                    Sana: {new Date(data.date).toLocaleDateString()}
                  </Typography>
                </Box>
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
            backgroundColor: "#e0e0e0", // Lighter grayish background
            color: "#003366", // Text color
          }}
        >
          <Typography variant="h3" color="#003366">
            Loan Chat
          </Typography>
          <Box
            flex={1}
            overflow="auto"
            mb={2}
            display="flex"
            flexDirection="column"
          >
            {loanInfo?.messages.length > 0 ? (
              <Box width="100%">
                {loanInfo.messages.map((msg, index) => {
                  const isMe = msg.admin.id === meData?.id;
                  const isFileMessage = msg.message.includes("File uploaded:");
                  return (
                    <Box
                      key={index}
                      sx={{
                        mb: 1,
                        display: "flex",
                        justifyContent: isMe ? "flex-end" : "flex-start",
                      }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: "4px",
                          backgroundColor: isMe ? "#cce5ff" : "#003366",
                          color: isMe ? "#003366" : "#ffffff",
                          maxWidth: "70%",
                        }}
                      >
                        {isFileMessage ? (
                          <>
                            <Typography
                              sx={{ fontFamily: "Arial, sans-serif" }}
                            >
                              {"Yuklangan file"}
                            </Typography>
                            <Button
                              variant="outlined"
                              color="primary"
                              href={msg.message.split("File uploaded: ")[1]}
                              target="_blank"
                              sx={{
                                backgroundColor: "#003366",
                                "&:hover": { backgroundColor: "#002244" },
                              }}
                            >
                              Download File
                            </Button>

                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "0.75rem",
                                fontFamily: "Arial, sans-serif",
                              }}
                            >
                              {msg.admin.name} -{" "}
                              {new Date(msg.createdAt).toLocaleString()}
                            </Typography>
                          </>
                        ) : (
                          <>
                            <Typography
                              sx={{ fontFamily: "Arial, sans-serif" }}
                            >
                              {msg.message}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "0.75rem",
                                fontFamily: "Arial, sans-serif",
                              }}
                            >
                              {msg.admin.name} -{" "}
                              {new Date(msg.createdAt).toLocaleString()}
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Typography variant="body1" color="#003366">
                No messages
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />
          <Box display="flex">
            <TextField
              fullWidth
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              sx={{
                mr: 1,
                backgroundColor: "#ffffff",
                borderRadius: "4px",
              }}
              InputProps={{
                style: {
                  color: "#003366",
                },
              }}
            />
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSendMessage}
              sx={{
                backgroundColor: "#003366",
                "&:hover": { backgroundColor: "#002244" },
              }}
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
