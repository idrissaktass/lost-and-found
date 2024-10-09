import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import { Box, Grid } from '@mui/system';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { SvgIcon, Typography, CircularProgress, CardMedia } from '@mui/material';
import './ListingDetails.css';
import MessageIcon from '@mui/icons-material/Message';
import { useNavigate } from "react-router-dom";
import Messaging from './Messaging';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import PetsIcon from '@mui/icons-material/Pets';

const LostDetails = () => {
    const { id } = useParams();
    const [lost, setLost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showContent, setShowContent] = useState(false);
    const [isMessagesOpen, setIsMessagesOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();
    const [userName, setUserName] = useState(localStorage.getItem("username") || "username");

    useEffect(() => {
        const fetchLost = async () => {
            try {
                const response = await fetch(`https://lost-and-found-backend-six.vercel.app/api/lost/${userName}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch lost');
                }
                const data = await response.json();
                setLost(data);
                setTimeout(() => {
                  setShowContent(true);
              }, 100);
            } catch (err) {
                setError('Failed to load the lost');
            } finally {
                setLoading(false);
            }
        };

        fetchLost();
    }, [id]);

    if (loading) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh'
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!lost) {
        return <div>No lost found.</div>;
    }

    const handleMessagesOpen = () => {
        if (!isAuthenticated) {
            setSnackbarOpen(true);
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } else {
            setIsMessagesOpen(true);
            console.log("Opening Messages Modal");
        }
    };

    const handleMessagesClose = () => {
        setIsMessagesOpen(false); 
      };


    const formattedDate = new Date(lost.createdAt).toLocaleDateString('en-CA');
    return (
        <div>
            <Navbar />
            <Grid container justifyContent={'center'}>
                <Grid size={{ xs: 12, sm:10, md: 8, lg: 6 }} gap={2}  sx={{background: 'linear-gradient(to right, #0088ff8c, #007fff2b)'}} pt={10} px={3}
                height={"100vh"} overflow={"auto"} position={"absolute"} top={"0"} zIndex={"-999"}
                 boxShadow={"0px 5px 10px #b4b4b4"} container flexDirection={'column'} className={`content ${showContent ? 'open' : 'closed'}`}>
                    {lost.images.length > 0 && (
                        <Grid size={{ xs: 12 }} display={'flex'} justifyContent={'center'} overflow={'hidden'}>
                            <CardMedia
                                component="img"
                                alt={lost.title}
                                height={400}
                                src={lost.images[0]}
                            />
                        </Grid>
                    )}
                    <Typography variant="h1">{lost.title}</Typography>
                    <Typography variant="body2">{lost.description}</Typography>
                    <Typography variant="body2" display={'flex'} alignItems={'center'} gap={1}>
                        <SvgIcon component={lost.type === "Pets" ? PetsIcon : CollectionsBookmarkIcon} color='secondary' fontSize='large' />
                    </Typography>
                    <Typography variant="body2" display={'flex'} alignItems={'center'} gap={1}>
                        <SvgIcon component={PersonIcon} color='secondary' fontSize='large' />{lost.createdBy}  
                        {lost.createdBy !== userName && (
                            <SvgIcon component={MessageIcon} color='secondary' fontSize='large' onClick={handleMessagesOpen}
                                sx={{cursor:"pointer"}}/>
                        )}
                    </Typography>
                    <Typography variant="body2" display={'flex'} alignItems={'center'} gap={1}>
                        <SvgIcon component={LocationOnIcon} color='secondary' fontSize='large' />{lost.location}
                    </Typography>
                    <Typography variant="body2" display={'flex'} alignItems={'center'} gap={1}>
                        <SvgIcon component={CalendarMonthIcon} color='secondary' fontSize='large' />{formattedDate}
                    </Typography>
                </Grid>
            </Grid>
            <Messaging open={isMessagesOpen} onClose={handleMessagesClose} recipient={lost.createdBy}/>
        </div>
    );
};

export default LostDetails;
