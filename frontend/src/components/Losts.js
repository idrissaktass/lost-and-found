import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, MenuItem, Select, FormControl, CircularProgress } from '@mui/material';
import { Grid } from "@mui/system";
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import './ListingDetails.css';

const Losts = () => {
    const [losts, setLosts] = useState([]);
    const [filteredLosts, setFilteredLosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showContent, setShowContent] = useState(false);
    useEffect(() => {
        const fetchLosts = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://lost-and-found-backend-red.vercel.app/api/losts");
                if (!response.ok) {
                    throw new Error("Failed to fetch losts");
                }
                const data = await response.json();
                const filteredListings = data.filter(lost => lost.type !== "Pets");
                const sortedLosts = filteredListings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setLosts(sortedLosts);
                setFilteredLosts(sortedLosts);
                setTimeout(() => {
                    setShowContent(true);
                }, 1);
            } catch (error) {
                console.error(error);
                setError("Failed to fetch losts");
            } finally {
                setLoading(false);
            }
        };

        fetchLosts();
    }, []);

    const handleCategoryChange = (event) => {
        const category = event.target.value;
        setSelectedCategory(category);

        if (category === "") {
            setFilteredLosts(losts);
        } else {
            const filtered = losts.filter(lost => lost.category === category);
            setFilteredLosts(filtered);
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

    const categories = [...new Set(losts.map(lost => lost.category))];

    return (
        <Grid height={"100vh"} overflow={"hidden"}>
            <Navbar />
            <Box flexGrow={1}>
                <Grid container justifyContent={"center"}>
                    <Grid item size={{ xs: 12, md: 10, lg: 9 }} height={"91.8vh"} mb={15} overflow={"auto"}  sx={{background: 'linear-gradient(to right, #0088ff8c, #007fff2b)'}}
                     boxShadow={"0px 5px 10px #b4b4b4"} 
                    py={3} px={{xs:1, sm:3}} className={`content ${showContent ? 'open' : 'closed'}`}>
                        <Grid>
                            <Typography textAlign={"center"} variant="h1">All Lost Items</Typography>
                        </Grid>
                        <div>
                            <Grid container spacing={{xs:1, sm:2}} mb={8}>
                                <Grid size={{ xs: 12 }} display={"flex"} alignItems={"center"} marginBottom={3} mt={{xs:2, md:0}}>
                                    <FormControl sx={{ minWidth: 200 }}>
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
                                {filteredLosts.map((lost) => (
                                    <Grid item size={{ xs: 6, md: 3 }} key={lost._id}>
                                        <Link to={`/lost/${lost._id}`} style={{ textDecoration: 'none' }}>
                                            <Card>
                                                {lost.images.length > 0 && (
                                                    <CardMedia
                                                        component="img"
                                                        alt={lost.title}
                                                        height="180"
                                                        image={lost.images[0]}
                                                    />
                                                )}
                                                <CardContent>
                                                    <Typography gutterBottom variant="h6" component="div">
                                                        {lost.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {lost.description}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                        Posted by: {lost.createdBy || 'Unknown'}
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
};

export default Losts;
