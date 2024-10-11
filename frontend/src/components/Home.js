import React, { useEffect, useState } from "react";
import { Button, Typography, Card, CardContent, CardMedia, CircularProgress } from "@mui/material";
import Navbar from "./Navbar";
import { Box, Grid } from "@mui/system";
import { Link } from "react-router-dom";
import './ListingDetails.css'; 

const Home = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);
    const [pets, setPets] = useState([]);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await fetch("https://lost-and-found-backend-red.vercel.app/api/listings");
                if (!response.ok) {
                    throw new Error("Failed to fetch listings");
                }
                const data = await response.json();
                const filteredListings = data.filter(listing => listing.type !== "Pets");
                const pets = data.filter(listing => listing.type === "Pets");
                setListings(filteredListings);
                setShowContent(true);
                setPets(pets);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    const groupedListings = listings.reduce((acc, listing) => {
        acc[listing.category] = acc[listing.category] || [];
        acc[listing.category].push(listing);
        return acc;
    }, {});

    return (
        <Grid height={"100vh"} overflow={"hidden"}>
            <Navbar />
            <Box flexGrow={1}>
            <Box flexGrow={1} sx={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'url(/items.png),  url(/items.png), url(/pets.png), url(/pets.png)',
                backgroundSize: {
                    xs: '50% 25%', // Larger on smaller screens
                    sm: '25% 25%',
                    md: '30% 25%', // Default size on medium and larger screens
                    lg: '25% 25%',
                },
                backgroundPosition: {
                    xs: '0 0, 0 0, 100% 0, 100% 0', // Different positions for smaller screens
                    sm: '0 0, 30% 0, 70% 0, 100% 0',
                    md: '0 0, 41.2% 0, 60% 0, 100% 0', // Default positions on medium and larger screens
                    lg: '0 0, 32% 0, 68% 0, 100% 0',
                },
                backgroundRepeat: 'repeat-y, repeat-y, repeat-y, repeat-y', // Images repeat vertically
                opacity: 0.1,
                zIndex: -1,
            }}>
                <Grid container justifyContent={"center"} pb={10}>
                    <Grid item size={{ xs: 12, md: 10, lg: 9 }} height={"91.8vh"} sx={{ background: 'linear-gradient(to right, #0088ff8c, #007fff2b)' }}
                        overflow={"auto"} boxShadow={"0px 5px 10px #b4b4b4"} px={{ xs: 1, sm: 3 }} py={3} className={`content ${showContent ? 'open' : 'closed'}`}>
                        <Grid>
                            <Typography textAlign={"center"} variant="h1">Last Founds</Typography>
                        </Grid>
                        {loading ? (
                            <Grid size={{ xs: 12 }} display={"flex"} justifyContent={"center"} alignItems={"center"}><CircularProgress /></Grid>
                        ) : (
                            <>                                                    
                                {pets.length > 0 && (
                                    <Grid mb={-5}>
                                        <Typography variant="h5" sx={{ mb: 1 }}>Pets</Typography>
                                        <Grid container spacing={{ xs: 0.5, sm: 2 }} mb={10}>
                                            {pets.slice(-4).map((pet) => (
                                                <Grid item size={{ xs: 6, md: 3 }} key={pet._id}>
                                                    <Link to={`/listing/${pet._id}`} style={{ textDecoration: 'none' }}>
                                                        <Card>
                                                            {pet.images.length > 0 && (
                                                                <CardMedia
                                                                    component="img"
                                                                    alt={pet.title}
                                                                    height="180"
                                                                    image={pet.images[0]}
                                                                />
                                                            )}
                                                            <CardContent>
                                                                <Typography gutterBottom variant="h6" component="div">
                                                                    {pet.title}
                                                                </Typography>
                                                                <Typography variant="body2" display={{xs:"none", sm:"unset"}} color="text.secondary">
                                                                    {pet.description}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                                    Posted by: {pet.createdBy || 'Unknown'}
                                                                </Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </Link>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Grid>
                                )}
                                {Object.keys(groupedListings).map((category, index) => (
                                    <div key={category}>
                                        <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>{category}</Typography>
                                        <Grid container spacing={{ xs: 0.5, sm: 2 }} mb={index === Object.keys(groupedListings).length - 1 ? 10 : 0}>
                                            {groupedListings[category].slice(-4).map((listing) => ( 
                                                <Grid item size={{ xs: 6, md: 3 }} key={listing._id}>
                                                    <Link to={`/listing/${listing._id}`} style={{ textDecoration: 'none' }}>
                                                        <Card>
                                                            {listing.images.length > 0 && (
                                                                <CardMedia
                                                                    component="img"
                                                                    alt={listing.title}
                                                                    height="180"
                                                                    image={listing.images[0]}
                                                                />
                                                            )}
                                                            <CardContent>
                                                                <Typography gutterBottom variant="h6" component="div">
                                                                    {listing.title}
                                                                </Typography>
                                                                <Typography variant="body2" display={{xs:"none", sm:"unset"}} color="text.secondary">
                                                                    {listing.description}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                                    Posted by: {listing.createdBy || 'Unknown'}
                                                                </Typography>
                                                            </CardContent>
                                                        </Card>
                                                    </Link>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </div>
                                ))}
                            </>
                        )}
                    </Grid>
                </Grid>
                </Box>
            </Box>
        </Grid>
    );
};

export default Home;
