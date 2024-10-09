import React, { useState } from 'react';
import { Grid2, TextField, Button, Typography, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signupService } from '../services/Services';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password.length < 6) {
      setSnackbarMessage('Password must be at least 6 characters long.');
      setSnackbarOpen(true);
      return;
    }
    
    if (!email.includes('@')) {
      setSnackbarMessage('Please enter a valid email address.');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      const token = await signupService(username, email, password);
      localStorage.setItem("token", token);
      navigate('/'); 
    } catch (err) {
      console.error('Signup failed', err);
      setSnackbarMessage('Signup failed. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
            Signup
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid2 container spacing={2}  alignItems={"center"}>
            <Grid2 item size={{xs:12, sm:12 }}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
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
                  label="Username"
                  variant="outlined"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
              <Grid2 item xs={12}>
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Signup"}
                </Button>
              </Grid2>
            </Grid2>
          </form>
        </Box>
        <Typography mt={1} textAlign={"end"}>
          Do you have an account? 
          <span onClick={() => navigate("/login")} style={{ cursor: "pointer", color: "#1976d2" }}>
            Sign In.
          </span>
        </Typography>
      </Grid2>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid2>
  );
};

export default Signup;
