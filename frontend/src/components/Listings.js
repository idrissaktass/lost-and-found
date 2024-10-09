import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, MenuItem, Select, FormControl, CircularProgress, Autocomplete, TextField, InputAdornment, IconButton } from '@mui/material';
import { Grid } from "@mui/system";
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search'; 
import Navbar from './Navbar';
import './ListingDetails.css';

const Listings = () => {
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [locationSuggestions, setLocationSuggestions] = useState([]); 
    const [showContent, setShowContent] = useState(false); 

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://lost-and-found-backend-six.vercel.app/api/listings");
                if (!response.ok) {
                    throw new Error("Failed to fetch listings");
                }
                const data = await response.json();
                const filteredListings = data.filter(listing => listing.type !== "Pets");
                const sortedListings = filteredListings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setListings(sortedListings);
                setFilteredListings(sortedListings);
                setTimeout(() => {
                    setShowContent(true);
                }, 1);
            } catch (error) {
                console.error(error);
                setError("Failed to fetch listings");
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        filterListings(event.target.value, locationFilter);
    };

    const handleLocationChange = (event, newLocation) => {
        setLocationFilter(newLocation);
        filterListings(selectedCategory, newLocation);
    };

    const filterListings = (category, location) => {
        let filtered = listings;

        if (category !== "") {
            filtered = filtered.filter(listing => listing.category === category);
        }

        if (location && location !== "") {
            filtered = filtered.filter(listing => 
                listing.location.toLowerCase().startsWith(location.toLowerCase())
            );
        }

        setFilteredListings(filtered);
    };

    const handleSearch = () => {
        filterListings(selectedCategory, locationFilter);
    };

    const handleLocationInputChange = (event, value) => {
        setLocationFilter(value);
        if (value) {
            const suggestions = [...new Set(listings
                .filter(listing => listing.location.toLowerCase().startsWith(value.toLowerCase()))
                .map(listing => listing.location))];
            setLocationSuggestions(suggestions);
        } else {
            setFilteredListings(listings); 
            setLocationSuggestions([]);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        if (locationFilter === "") {
            setFilteredListings(listings);
        }
    }, [locationFilter, listings]);

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
        return <Typography>{error}</Typography>;
    }

    const categories = [...new Set(listings.map(listing => listing.category))];

    return (
        <Grid height={"100vh"} overflow={"hidden"}>
            <Navbar />
            <Box flexGrow={1}>
                <Grid container justifyContent={"center"}>
                    <Grid item size={{ xs: 12, md: 10, lg: 9 }} height={"91.8vh"} overflow={"auto"}  sx={{background: 'linear-gradient(to right, #0088ff8c, #007fff2b)'}}
                    boxShadow={"0px 5px 10px #b4b4b4"} py={3} px={{xs:1, sm:3}} className={`content ${showContent ? 'open' : 'closed'}`}>
                        <Grid>
                            <Typography textAlign={"center"} variant="h1">All Found Items</Typography>
                        </Grid>
                        <div>
                            <Grid container spacing={{xs:1, sm:2}} mb={8}>
                                <Grid container size={{xs:12}} justifyContent={"space-between"}>
                                    <Grid size={{ xs: 12, sm:5, lg:4 }} mt={{xs:2, md:0}}>
                                        <FormControl sx={{ minWidth: 200, mb: 2 }} fullWidth>
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

                                    <Grid size={{ xs: 12, sm:5, lg:4  }} mt={{xs:2, md:0}}>
                                        <Autocomplete
                                            freeSolo
                                            value={locationFilter}
                                            onInputChange={handleLocationInputChange}
                                            onChange={handleLocationChange}
                                            options={locationSuggestions}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Filter by Location"
                                                    variant="outlined"
                                                    fullWidth
                                                    onKeyPress={handleKeyPress}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: (
                                                            <>
                                                                <InputAdornment position="end">
                                                                    <IconButton onClick={handleSearch}>
                                                                        <SearchIcon />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                                {params.InputProps.endAdornment}
                                                            </>
                                                        ),
                                                    }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                                {filteredListings.length === 0 ? (
                                    <Typography variant="h6" textAlign="center" sx={{ mt: 2 }}>
                                        There are no founds in this location
                                    </Typography>
                                ) : (
                                    filteredListings.map((listing) => (
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
                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                            Location: {listing.location || 'Unknown'}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        </Grid>
                                    ))
                                )}
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    );
};

export default Listings;
