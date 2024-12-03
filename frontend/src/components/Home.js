import React, { useEffect, useState } from "react";
import { Button, Typography, Snackbar, Alert} from "@mui/material";
import Navbar from "./Navbar";
import { Box, Grid } from "@mui/system";
import { useNavigate } from "react-router-dom";

// import main from "/public/main.jpg"
const Home = () => {
    const backgroundImage = 'url(/main.jpg)'
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const navigate = useNavigate();

    const handleOpen2 = () => {
        if (!isAuthenticated) {
          setSnackbarOpen(true);
      
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          setIsModalOpen2(true);
        }
        console.log("xd")
      };

      const handleSnackbarClose = () => {
        setSnackbarOpen(false);
      };

    return (
        <Grid height={"100vh"} overflow={"hidden"}>
            <Box flexGrow={1}>
                <Grid container justifyContent={"center"} pb={10}>
                    <Grid item size={{xs: 12}} height={"100vh"}
                        overflow={"auto"} boxShadow={"0px 5px 10px #b4b4b4"}>
                        <Grid 
                        display={"flex"} 
                        padding={{xs:"30px", md:"80px"}} 
                        alignItems={"center"} 
                        sx={{
                            position: "relative",
                            backgroundImage: backgroundImage, 
                            backgroundSize: "cover", 
                            backgroundPosition: "center", 
                            height: "100%"
                        }}
                        >
                        <Grid
                            sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.65)",
                            zIndex: 1,
                            }}
                        />
                        
                        <Grid display={"flex"} flexDirection={"column"} gap={"20px"}
                            sx={{
                            position: "relative", 
                            zIndex: 2, 
                            color: "#fff"
                            }}
                        >
                            <Typography fontSize={"32px"} fontWeight={600} textTransform={"uppercase"}>
                            Lost Something? Found Something? Let's Reunite!
                            </Typography>
                            <Button onClick={handleOpen2}
                            sx={{
                                width:"fit-content",
                                backgroundColor: "#5454d5", 
                                padding: "10px 20px 10px 20px", 
                                borderRadius: "10px", 
                                '&:hover': {
                                backgroundColor: "#6b6bd9"
                                }
                            }}
                            >
                                <Typography color="#fff" fontSize={"24px"} fontWeight={500}>
                                    Post a Lost
                                </Typography>
                            </Button>
                        </Grid>
                        </Grid>

                    </Grid>
                </Grid>
            </Box>
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
        </Grid>
    );
};

export default Home;
