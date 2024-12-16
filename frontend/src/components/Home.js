import React, { useEffect, useState } from "react";
import { Button, Typography, Snackbar, Alert} from "@mui/material";
import Navbar from "./Navbar";
import { Box, Grid } from "@mui/system";
import { useNavigate } from "react-router-dom";
import LostModal from "./LostModal";

const Home = () => {
    const backgroundImage = 'url(/main.jpg)'
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.innerHTML = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MobileApplication",
            "name": "Lost and Found",
            "operatingSystem": "iOS, Android",
            "url": "https://www.lostandfound.online",
            "applicationCategory": "Utility",
            "offers": {
                "@type": "Offer",
                "priceCurrency": "USD",
                "price": "0",
                "url": "https://www.lostandfound.online/download"
            },
            "screenshot": "https://www.lostandfound.online/screenshot.png",
            "description": "Find lost items and pets with the Lost and Found app. Kayıp eşyalarınızı ve kayıp hayvanlarınızı bulun"
        });
        document.head.appendChild(script);
    }, []);
    
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

      const handleClose2 = () => {
        setIsModalOpen2(false); 
      };
      
    return (
        <Grid height={"100vh"} overflow={"hidden"}>
            <Navbar/>
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
                            <Typography id="lost-and-found-tr-header" fontSize={"32px"} fontWeight={600} textTransform={"uppercase"}>
                            Lost Something? Found Something? Let's Reunite!
                            </Typography>
                            <Button onClick={handleOpen2}
                            sx={{
                                width:"fit-content",
                                backgroundColor: "#ac5959", 
                                padding: "10px 20px 10px 20px", 
                                borderRadius: "10px", 
                                '&:hover': {
                                backgroundColor: "#ac5959"
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
            <LostModal open={isModalOpen2} onClose={handleClose2} />
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
