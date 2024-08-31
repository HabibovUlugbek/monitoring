import React, { useState } from "react";
import logo from "assets/logo.png";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "password") {
      localStorage.setItem("roleUpdated", true);
      navigate("/dashboard");
    } else if (username === "region" && password === "region") {
      localStorage.setItem("roleUpdated", true);
      navigate("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftSide}>
        <span>
          <img alt="ferferoo" src={logo} />
        </span>
        <h2 style={styles.heading}>National Bank of Uzbekistan</h2>
        <h2>Monitoring App</h2>
      </div>
      <div style={styles.rightSide}>
        <div style={styles.loginBox}>
          <h2 style={styles.loginHeading}>Welcome</h2>
          <input
            type="text"
            placeholder="Username"
            style={styles.inputField}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.inputField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p style={styles.errorText}>{error}</p>}
          <button style={styles.loginButton} onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    fontFamily: "Roboto, sans-serif",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  leftSide: {
    flex: 1,
    backgroundColor: "#003366",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: "20px",
    height: "100%",
  },
  heading: {
    marginBottom: "10px",
  },
  rightSide: {
    flex: 1,
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  loginBox: {
    width: "100%",
    maxWidth: "300px",
    backgroundColor: "#f9f9f9",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  loginHeading: {
    marginBottom: "20px",
    fontSize: "22px",
    color: "#333",
    textAlign: "center",
  },
  inputField: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxSizing: "border-box",
    color: "#007aff",
  },
  loginButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#003366",
    border: "none",
    borderRadius: "5px",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: "10px",
  },
};

export default LoginPage;
