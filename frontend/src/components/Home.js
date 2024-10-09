import React, { useEffect, useState } from "react";
import { Button, Typography, Card, CardContent, CardMedia, CircularProgress } from "@mui/material";
import Navbar from "./Navbar";
import ListingModal from "./ListingModal";
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
                const response = await fetch("http://localhost:5000/routes/listings");
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

    const combinedListings = [...listings, ...pets];

    const groupedListings = combinedListings.reduce((acc, listing) => {
        acc[listing.category] = acc[listing.category] || [];
        acc[listing.category].push(listing);
        return acc;
    }, { Pets: [] });

    pets.forEach(pet => {
        groupedListings.Pets.push(pet);
    });

    return (
        <Grid height={"100vh"} overflow={"hidden"}>
            <Navbar />
            <Box flexGrow={1}>
                <Grid container justifyContent={"center"} pb={10}>
                    <Grid item size={{ xs: 12, md: 10, lg: 9 }} height={"91.8vh"} sx={{ background: 'linear-gradient(to right, #0088ff8c, #007fff2b)' }}
                        overflow={"auto"} boxShadow={"0px 5px 10px #b4b4b4"} px={{ xs: 1, sm: 3 }} py={3} className={`content ${showContent ? 'open' : 'closed'}`}>
                        <Grid>
                            <Typography textAlign={"center"} variant="h1">Last Founds</Typography>
                        </Grid>
                        {loading ? (
                            <Grid size={{ xs: 12 }} display={"flex"} justifyContent={"center"} alignItems={"center"}><CircularProgress /></Grid>
                        ) : (
                            Object.keys(groupedListings).map((category, index) => (
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
                                                            <Typography variant="body2" color="text.secondary">
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
                            ))
                        )}
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    );
};

export default Home;
