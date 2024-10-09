import React, { useState } from "react";
import { TextField, Button, Snackbar, Grid2, Typography, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loginService } from "../services/Services";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const { token, user } = await loginService(email, password);
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      console.log("user", user);
      localStorage.setItem("username", user.username);
      setIsAuthenticated(true);
      setSnackbarMessage("Login successful!");
      navigate("/");
    } catch (error) {
      setSnackbarMessage("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <Grid2 container justifyContent="center" alignItems="center" sx={{ minHeight: "100vh" }}>
      <Grid2 item xs={11} sm={8} md={6} lg={5} xl={4}>
        <Box
          sx={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            position: "relative",
          }}
        >
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1,
              }}
            />
          )}
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <Grid2 container spacing={2} alignItems={"center"}>
              <Grid2 item size={{xs:12, sm:6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </Grid2>
              <Grid2 item size={{xs:12, sm:6 }}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </Grid2>
              <Grid2 item size={{xs:12, sm:6 }}>
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Grid2>
            </Grid2>
          </form>
        </Box>
        <Snackbar
          open={openSnackbar}
          onClose={() => setOpenSnackbar(false)}
          message={snackbarMessage}
          autoHideDuration={4000}
        />
        <Typography mt={1} textAlign={"end"}>
          Don't you have an account? <span onClick={() => navigate("/signup")} style={{ cursor: "pointer", color: "#1976d2" }}>Sign Up.</span>
        </Typography>
      </Grid2>
    </Grid2>
  );
};

export default Login;
