import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Snackbar,
  Grid2,
  useMediaQuery, Alert
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ListingModal from "./ListingModal";
import Messaging from "./Messaging";
import LostModal from "./LostModal";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [showLogin, setShowLogin] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem("username") || "username");
  const [activePage, setActivePage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setActivePage("Home");
    else if (path === "/listings") setActivePage("Founds");
    else if (path === "/losts") setActivePage("Losts");
    else if (path === "/my-listings") setActivePage("My Listings");
    else if (path === "/pets") setActivePage("Pets");
  }, [location]); 

  useEffect(() => {
    const fetchMessages = async () => {
        try {
            const response = await fetch(`https://lost-and-found-backend-six.vercel.app/api/messages/getUnread?username=${userName}`);
            const data = await response.json();
            console.log("API Response:", data);
            
            if (data.messages && data.unreadMessages) {
                setMessageCount(data.unreadMessages.length);
                console.log("Unread messages count:", data.unreadMessages.length);
            } else {
                console.warn("No messages found or data structure is incorrect.");
                setMessageCount(0);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };
    
    fetchMessages();
}, [userName]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleHamburgerMenuOpen = (event) => {
    setMenuOpen(event.currentTarget);
  };

  const handleHamburgerMenuClose = () => {
    setMenuOpen(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");

    setIsAuthenticated(false);
    setUserName("User");
    handleMenuClose();
    window.location.reload();
  };

  const handleHome = () => {
    navigate("/");
    handleHamburgerMenuClose();
  };

  const handlePets = () => {
    navigate("/pets");
    handleHamburgerMenuClose();
  };

  const handleFounds = () => {
    navigate("/listings");
    handleHamburgerMenuClose();
  };

  const handleLosts = () => {
    navigate("/losts");
    handleHamburgerMenuClose();
  };

  const handleMyListings = () => {
    navigate("/my-listings");
    handleMenuClose();
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);

  const handleOpen = () => {
    if (!isAuthenticated) {
      setSnackbarOpen(true);
  
      setTimeout(() => {
        navigate("/login");
      }, 2000); 
    } else {
      setIsModalOpen(true);
    }
  };
  

  const handleClose = () => {
    setIsModalOpen(false); 
  };

  const handleOpen2 = () => {
    if (!isAuthenticated) {
      setSnackbarOpen(true);
  
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setIsModalOpen2(true);
    }
  };
  

  const handleMessagesOpen = () => {
    if (!isAuthenticated) {
        setSnackbarOpen(true); 
        setTimeout(() => {
            navigate("/login");
        }, 2000);
    } else {
        setMessageCount(0)
        setIsMessagesOpen(true);
        console.log("Opening Messages Modal");
    }
    handleMenuClose();
};

  const handleMessagesClose = () => {
    setIsMessagesOpen(false); 
  };

  const handleClose2 = () => {
    setIsModalOpen2(false); 
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#00468c", zIndex:"999" }}>
      <Toolbar>
        <Grid2 flexGrow={1}>
          <Typography onClick={handleHome} sx={{cursor:"pointer"}} width={"fit-content"} variant="h2">LostandFound</Typography>
        </Grid2>

        {isSmallScreen ? (
          <>
            <IconButton
              color="inherit"
              edge="end"
              onClick={handleHamburgerMenuOpen}
              sx={{ 
                color: 'white',
                mr: 0,
              }}
            >
              <MenuIcon fontSize="large" />
            </IconButton>
            <Menu
              anchorEl={menuOpen}
              open={Boolean(menuOpen)}
              onClose={handleHamburgerMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: "#333",
                  color: "white", 
                  width: "200px",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                  marginLeft:"15px"
                }
              }}
              MenuListProps={{
                sx: {
                  padding: 0,
                }
              }}
            >
              <MenuItem onClick={handleHome}               
                sx={{
                  backgroundColor: activePage === "Home" ? "#ac5959" : "transparent",
                  color: activePage === "Home" ? "white" : "inherit",
                }}>
                Home
              </MenuItem>
              <MenuItem onClick={handlePets}               
                sx={{
                  backgroundColor: activePage === "Pets" ? "#ac5959" : "transparent",
                  color: activePage === "Pets" ? "white" : "inherit",
                }}>
                Pets
              </MenuItem>
              <MenuItem onClick={handleFounds}
                sx={{
                  backgroundColor: activePage === "Founds" ? "#ac5959" : "transparent",
                  color: activePage === "Founds" ? "white" : "inherit",
                }}>
                Found Items
              </MenuItem>
              <MenuItem onClick={handleLosts}
                sx={{
                  backgroundColor: activePage === "Losts" ? "#ac5959" : "transparent",
                  color: activePage === "Losts" ? "white" : "inherit",
                }}>
                Lost Items
              </MenuItem>
              <MenuItem onClick={handleOpen}
                sx={{
                  backgroundColor: "transparent",
                  color: "inherit",
                }}>
                Post a Found
              </MenuItem>
              <MenuItem onClick={handleOpen2}
                sx={{
                  backgroundColor: "transparent",
                  color: "inherit",
                }}>
                Post a Lost
              </MenuItem>
              {isAuthenticated ? (
                  <>
                    <MenuItem onClick={handleMyListings}
                      sx={{
                        backgroundColor: activePage === "My Listings" ? "#ac5959" : "transparent",
                        color: activePage === "My Listings" ? "white" : "inherit",
                      }}>
                      My Listings
                    </MenuItem>
                    <MenuItem onClick={handleMessagesOpen}>
                      Messages {messageCount > 0 && `(${messageCount})`}
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      Logout
                    </MenuItem>
                </>
              ) : (
                <MenuItem onClick={() => navigate("/login")}>
                  Login
                </MenuItem>
              )}
            </Menu>
          </>

        ) : (
          <Box sx={{ display: "flex", ml: 2 }} gap={1}>
            <Button
              color="inherit"
              onClick={handleHome}
              sx={{
                backgroundColor: activePage === "Home" ? "#ac5959" : "transparent",
                color: activePage === "Home" ? "white" : "inherit",
              }}
            >
              <Typography variant="body2">Home</Typography>
            </Button>
            <Button
              color="inherit"
              onClick={handlePets}
              sx={{
                backgroundColor: activePage === "Pets" ? "#ac5959" : "transparent",
                color: activePage === "Pets" ? "white" : "inherit",
              }}
            >
              <Typography variant="body2">Pets</Typography>
            </Button>
            <Button
              color="inherit"
              onClick={handleFounds}
              sx={{
                backgroundColor: activePage === "Founds" ? "#ac5959" : "transparent",
                color: activePage === "Founds" ? "white" : "inherit",
              }}
            >
              <Typography variant="body2">Found Items</Typography>
            </Button>
            <Button
              color="inherit"
              onClick={handleLosts}
              sx={{
                backgroundColor: activePage === "Losts" ? "#ac5959" : "transparent",
                color: activePage === "Losts" ? "white" : "inherit",
              }}
            >
              <Typography variant="body2">Lost Items</Typography>
            </Button>
            <Button
              color="inherit"
              onClick={handleOpen}
              sx={{
                backgroundImage: "linear-gradient(45deg, #ac5959, transparent)",
                color: "inherit",
                transition: "background-color 0.4s ease",
              }}
            >
              <Typography variant="body2">Post a Found</Typography>
            </Button>
            <Button
              color="inherit"
              onClick={handleOpen2}
              sx={{
                backgroundImage: "linear-gradient(45deg, transparent,  #ac5959)",
                color: "inherit",
                transition: "background-color 0.4s ease",
              }}
            >
              <Typography variant="body2">Post a Lost</Typography>
            </Button>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {isAuthenticated ? (
                <>
                  <Button
                    color="inherit"
                    onClick={handleMenuOpen}
                    sx={{
                      backgroundColor: activePage === "My Listings" ? "#ac5959" : "transparent",
                      color: activePage === "My Listings" ? "white" : "inherit",
                    }}
                  >
                   <Typography variant="body2">{userName}</Typography>
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: {
                        backgroundColor: "#333",
                        color: "white",
                        width: "200px",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                        marginLeft:"15px"
                      }
                    }}
                  >
                    <MenuItem onClick={handleMyListings}
                      sx={{
                        backgroundColor: activePage === "My Listings" ? "#ac5959" : "transparent",
                        color: activePage === "My Listings" ? "white" : "inherit",
                      }}>My Listings</MenuItem>
                    <MenuItem onClick={handleMessagesOpen}                      
                      sx={{
                        backgroundColor: "transparent",
                        color: "inherit",
                      }}>Messages</MenuItem>
                    <MenuItem onClick={handleLogout}                     
                      sx={{
                        backgroundColor:"transparent",
                        color: "inherit",
                      }}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button color="inherit" onClick={() => navigate("/login")}>
                  <Typography variant="body2">Login</Typography>
                </Button>
              )}
            </Box>
          </Box>
        )}

        {/* Modals */}
        <ListingModal open={isModalOpen} onClose={handleClose} />
        <LostModal open={isModalOpen2} onClose={handleClose2} />
        <Messaging open={isMessagesOpen} onClose={handleMessagesClose} recipient={""}/>
        {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: "100%" }}>
          You need to log in first to post a listing!
        </Alert>
      </Snackbar>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
