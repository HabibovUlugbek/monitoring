import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
// import axios from "axios";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      //   const response = await axios.post("https://your-backend-api.com/login", {
      //     username,
      //     password,
      //   });

      if (username === "admin" && password === "admin") {
        if (username === "admin" && password === "admin") {
          navigate("/dashboard");
          console.log("Login successful");
        }
        console.log("Login successful");
      } else {
        // Handle login failure
        setError(true);
        setErrorMessage("Login failed. Please check your credentials.");
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      // Handle errors from the request itself
      setError(true);
      setErrorMessage("An error occurred. Please try again later.");
      setUsername("");
      setPassword("");
    }
  };

  const handleClose = () => {
    setError(false);
  };

  return (
    <Container maxWidth="xs">
      <Paper
        elevation={3}
        style={{
          padding: "2rem",
          marginTop: "4rem",
          backgroundColor: "#1a1c2c",
          color: "#ffffff",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          style={{ color: "#e6e8ff" }}
        >
          LOAN-VISION
        </Typography>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { margin: "0.5rem 0" },
            display: "flex",
            flexDirection: "column",
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleLogin}
        >
          <TextField
            label="Username"
            variant="filled"
            InputLabelProps={{ style: { color: "#e6e8ff" } }}
            InputProps={{ style: { color: "#e6e8ff" }, disableUnderline: true }}
            fullWidth
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{
              backgroundColor: "#2a2e4e",
              borderRadius: "4px",
            }}
          />
          <TextField
            label="Password"
            variant="filled"
            type="password"
            InputLabelProps={{ style: { color: "#e6e8ff" } }}
            InputProps={{ style: { color: "#e6e8ff" }, disableUnderline: true }}
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              backgroundColor: "#2a2e4e",
              borderRadius: "4px",
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              marginTop: "1rem",
              backgroundColor: "#ffcc00",
              color: "#000",
              "&:hover": {
                backgroundColor: "#e6b800",
              },
            }}
          >
            Login
          </Button>
        </Box>
      </Paper>

      <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage;
