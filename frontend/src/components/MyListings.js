import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, MenuItem, Select, FormControl, CircularProgress } from '@mui/material';
import { Grid } from "@mui/system";
import { Link } from 'react-router-dom'; 
import Navbar from './Navbar';

const MyListings = () => {
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");

    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await fetch(`https://lost-and-found-backend-six.vercel.app/api/mylistings?username=${username}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch listings");
                }
                const data = await response.json();
                const sortedListings = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setListings(sortedListings);
                setFilteredListings(sortedListings);
            } catch (error) {
                console.error(error);
                setError("Failed to fetch listings");
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [username]);

    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setSelectedCategory(category);
        if (category === "") {
            setFilteredListings(listings);
        } else {
            const filtered = listings.filter(listing => listing.category === category);
            setFilteredListings(filtered);
        }
    };

    if (loading) {
        return (
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
                <CircularProgress />
            </Grid>
        );
    }

    if (error) {
        return <Typography>{error}</Typography>;
    }

    const categories = [...new Set(listings.map(listing => listing.category))];

    return (
        <Grid height={"100vh"} overflow={"hidden"}>
            <Navbar />
            <Box flexGrow={1}>
                <Grid container justifyContent={"center"}>
                    <Grid item size={{ xs: 12, md: 10, lg: 9 }} height={"91.8vh"} overflow={"auto"}  sx={{background: 'linear-gradient(to right, #0088ff8c, #007fff2b)'}}
                    boxShadow={"0px 5px 10px #b4b4b4"} py={3} px={{xs:1, sm:3}}>
                        <Grid>
                            <Typography textAlign={"center"} variant="h1">My Listings</Typography>
                        </Grid>
                        <div>
                            <Grid container spacing={{xs:1, sm:2}} mb={8}>
                                <Grid size={{ xs: 12 }} mb={{xs:3, sm:4}} mt={{xs:3, sm:1}}>
                                    <FormControl sx={{ minWidth: 200}} >
                                        <Select
                                            labelId="category-select-label"
                                            value={selectedCategory}
                                            onChange={handleCategoryChange}
                                            displayEmpty
                                        >
                                            <MenuItem value="">
                                                <em>All Categories</em>
                                            </MenuItem>
                                            {categories.map((category, index) => (
                                                <MenuItem key={index} value={category}>
                                                    {category}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                {filteredListings.map((listing) => (
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
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    );
}

export default MyListings;
