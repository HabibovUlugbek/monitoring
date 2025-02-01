import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "assets/logo.png";
import { useSignInAdminQuery, useGetMeQuery } from "state/api";
import { useSignInSuperAdminQuery } from "state/super-admin-api";
import { getCookie, setCookie } from "helper";
import { RoleEnum } from "constants";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuperAdmin, setShowSuperAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [inputValues, setInputValues] = useState({
    username: "",
    password: "",
    isSuperAdmin: false,
  });
  const navigate = useNavigate();
  const { data: meData } = useGetMeQuery();
  const {
    data: superAdminData,
    isSuccess: isSuperAdminSuccess,
    error: superAdminError,
  } = useSignInSuperAdminQuery(
    { username, password },
    { skip: !isSuperAdmin || !username || !password }
  );
  const {
    data: adminData,
    isSuccess: isAdminSuccess,
    error: adminError,
  } = useSignInAdminQuery(
    { username, password },
    { skip: isSuperAdmin || !username || !password }
  );

  console.log(meData);

  const navigateUsersByRole = useCallback(() => {
    setTimeout(() => {
      window.location.reload();
    }, 100);
    switch (RoleEnum[meData?.role]) {
      case RoleEnum.REPUBLIC_EMPLOYEE:
      case RoleEnum.REPUBLIC_BOSS:
        navigate("/dashboard");
        break;
      default:
        navigate("/loans");
    }
  }, [meData, navigate]);

  useEffect(() => {
    const accessToken = getCookie("accessToken");
    const refreshToken = getCookie("refreshToken");

    if (accessToken && refreshToken) {
      navigateUsersByRole();
    }

    const superAccessToken = getCookie("super-accessToken");
    const superRefreshToken = getCookie("super-refreshToken");

    if (superAccessToken && superRefreshToken) {
      navigate("/superadmin-dashboard");
    }
  }, [navigate, navigateUsersByRole]);

  const handleLogin = () => {
    const { username, password, isSuperAdmin } = inputValues;

    setUsername(username);
    setPassword(password);
    setIsSuperAdmin(isSuperAdmin);
  };

  useEffect(() => {
    if (isSuperAdmin) {
      if (isSuperAdminSuccess) {
        setCookie("super-accessToken", superAdminData.accessToken, 1);
        setCookie("super-refreshToken", superAdminData.refreshToken, 7);
        navigate("/superadmin-dashboard");
        setInputValues({
          username: null,
          password: null,
          isSuperAdmin: false,
        });
      } else if (superAdminError) {
        setError(
          superAdminError?.data?.message || "Invalid username or password"
        );
        setShowSuperAdmin(true);
      }
    } else {
      if (isAdminSuccess) {
        setCookie("accessToken", adminData.accessToken, 1);
        setCookie("refreshToken", adminData.refreshToken, 7);
        navigateUsersByRole();
        setInputValues({
          username: null,
          password: null,
          isSuperAdmin: false,
        });
      } else if (adminError) {
        setError(adminError?.data?.message || "Invalid username or password");
        setShowSuperAdmin(true);
      }
    }
  }, [
    isSuperAdmin,
    isSuperAdminSuccess,
    superAdminData,
    superAdminError,
    isAdminSuccess,
    adminData,
    adminError,
    navigate,
    navigateUsersByRole,
  ]);

  useEffect(() => {
    if (superAdminData) {
      setCookie("super-accessToken", superAdminData.accessToken, 1);
      setCookie("super-refreshToken", superAdminData.refreshToken, 7);
    }
    if (adminData) {
      setCookie("accessToken", adminData.accessToken, 1);
      setCookie("refreshToken", adminData.refreshToken, 7);
    }
  }, [superAdminData, adminData]);

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
            value={inputValues.username}
            onChange={(e) =>
              setInputValues({ ...inputValues, username: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.inputField}
            value={inputValues.password}
            onChange={(e) =>
              setInputValues({ ...inputValues, password: e.target.value })
            }
          />
          {error && <p style={styles.errorText}>{error}</p>}
          {showSuperAdmin && (
            <div style={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="superAdmin"
                checked={inputValues.isSuperAdmin}
                onChange={(e) =>
                  setInputValues({
                    ...inputValues,
                    isSuperAdmin: e.target.checked,
                  })
                }
              />
              <label htmlFor="superAdmin">Super Admin</label>
            </div>
          )}
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
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "10px",
    color: "#333",
  },
};

export default LoginPage;
