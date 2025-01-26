import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
import Dashboard from "scenes/dashboard";
import Admin from "scenes/admin";
import Loans from "scenes/loans";
import LoginPage from "scenes/login";
import SuperAdminDashboard from "scenes/super-admin-dashboard";
import LoanPage from "scenes/loan-page";

function App() {
  useEffect(() => {
    const handleStorageChange = (event) => {
      const updated = localStorage.getItem("roleUpdated");
      if (updated === "true") {
        localStorage.setItem("roleUpdated", false);
        window.location.href = "/login";
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/superadmin-dashboard"
              element={<SuperAdminDashboard />}
            />
            <Route path="/loan/:loanId" element={<LoanPage />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/loans" element={<Loans />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
