import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import { CardMedia, CircularProgress } from '@mui/material'; 
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { SvgIcon, Typography } from '@mui/material';
import { Box, Grid } from '@mui/system';
import './ListingDetails.css'; 
import Messaging from './Messaging';
import MessageIcon from '@mui/icons-material/Message' 
import { useNavigate } from "react-router-dom";
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import PetsIcon from '@mui/icons-material/Pets';

const ListingDetails = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showContent, setShowContent] = useState(false);
    const [isMessagesOpen, setIsMessagesOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const navigate = useNavigate();
    const [userName, setUserName] = useState(localStorage.getItem("username") || "username");

    useEffect(() => {
        const fetchListing = async () => {
            setLoading(true)
            try {
                const response = await fetch(`https://lost-and-found-backend-six.vercel.app/api/listing/${userName}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch listing');
                }
                const data = await response.json();
                setListing(data);
                
                setTimeout(() => {
                    setShowContent(true);
                }, 100); 
            } catch (err) {
                setError('Failed to load the listing');
            } finally {
                setLoading(false); 
            }
        };

        fetchListing();
    }, [id]);

    const handleMessagesClose = () => {
        setIsMessagesOpen(false); 
      };

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

    if (loading) {
        return (
            <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                height="100vh"
            >
                <CircularProgress /> 
            </Box>
        ); 
    }

    if (error) {
        return <div>{error}</div>; 
    }

    if (!listing) {
        return <div>No listing found.</div>;
    }

    const formattedDate = new Date(listing.createdAt).toLocaleDateString('en-CA'); 

    return (
        <Grid height={"100vh"} >
            <Navbar />
            <Box flexGrow={1}>
                <Grid container justifyContent={'center'}>
                    <Grid height={"100vh"} overflow={"auto"} position={"absolute"} top={"0"} zIndex={"-999"}
                        size={{ xs: 12, sm:10, md: 8, lg: 6 }} 
                        gap={2} 
                        sx={{background: 'linear-gradient(to right, #0088ff8c, #007fff2b)'}}
                        boxShadow={"0px 5px 10px #b4b4b4"} 
                        px={3}
                        pt={10}
                        container 
                        flexDirection={'column'} 
                        className={`content ${showContent ? 'open' : 'closed'}`} 
                    >
                        {listing.images.length > 0 && (
                            <Grid size={{ xs: 12 }} display={'flex'} justifyContent={'center'} overflow={'hidden'}>
                                <CardMedia
                                    component="img"
                                    width={"100%"}
                                    alt={listing.title}
                                    height={400}
                                    src={listing.images[0]}
                                />
                            </Grid>
                        )}
                        <Typography variant="h1">{listing.title}</Typography>
                        <Typography variant="body2">{listing.description}</Typography>
                        <Typography variant="body2" display={'flex'} alignItems={'center'} gap={1}>
                            <SvgIcon component={listing.type === "Pets" ? PetsIcon : CollectionsBookmarkIcon} color='secondary' fontSize='large' />
                            {listing.category}
                        </Typography>
                        <Typography variant="body2" display={'flex'} alignItems={'center'} gap={1}>
                            <SvgIcon component={PersonIcon} color='secondary' fontSize='large' />
                            {listing.createdBy} 
                            {listing.createdBy !== userName && (
                                <SvgIcon component={MessageIcon} color='secondary' fontSize='large' onClick={handleMessagesOpen}
                                    sx={{cursor:"pointer"}}/>
                            )}
                        </Typography>
                        <Typography variant="body2" display={'flex'} alignItems={'center'} gap={1}>
                            <SvgIcon component={LocationOnIcon} color='secondary' fontSize='large' />
                            {listing.location}
                        </Typography>
                        <Typography variant="body2" display={'flex'} alignItems={'center'} gap={1}>
                            <SvgIcon component={CalendarMonthIcon} color='secondary' fontSize='large' />
                            {formattedDate}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
            <Messaging open={isMessagesOpen} onClose={handleMessagesClose} recipient={listing.createdBy}/>
        </Grid>
    );
};

export default ListingDetails;
