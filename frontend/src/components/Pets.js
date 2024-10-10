import {
    Button,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    CardMedia,
    TextField,
    InputAdornment,
    IconButton,
} from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/system";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const Pets = () => {
    const [lostPets, setLostPets] = useState([]);
    const [foundPets, setFoundPets] = useState([]);
    const [displayedPets, setDisplayedPets] = useState([]);
    const [selectedType, setSelectedType] = useState('lost');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showContent, setShowContent] = useState(false);
    const [locationFilter, setLocationFilter] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState([]);

    const categories = ["Dogs", "Cats", "Birds", "Reptiles", "Other"];

    useEffect(() => {
        const fetchLostPets = async () => {
            try {
                const response = await fetch("https://lost-and-found-backend-red.vercel.app/api/losts");
                const data = await response.json();
                const filteredpets = data.filter(pet => pet.type === "Pets");
                const sortedLosts = filteredpets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setLostPets(sortedLosts);
                setDisplayedPets(sortedLosts);

                setShowContent(true);
            } catch (error) {
                console.error("Failed to fetch lost pets", error);
            }
        };

        const fetchFoundPets = async () => {
            try {
                const response = await fetch("https://lost-and-found-backend-red.vercel.app/api/listings");
                const data = await response.json();
                const filteredpets = data.filter(pet => pet.type === "Pets");
                const sortedFounds = filteredpets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                setFoundPets(sortedFounds);
                console.log("xdsssss",data)

                setShowContent(true);
            } catch (error) {
                console.error("Failed to fetch found pets", error);
            }
        };

        fetchLostPets();
        fetchFoundPets();
    }, []);

    const handleTypeChange = (type) => {
        setSelectedType(type);
        setDisplayedPets(type === 'lost' ? lostPets : foundPets);
        setLocationFilter(''); 
        setLocationSuggestions([]); 
    };

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setSelectedCategory(value);
        filterPets(value, locationFilter);
    };

    const filterPets = (category, location) => {
        const currentPets = selectedType === 'lost' ? lostPets : foundPets;

        let filteredPets = currentPets;
        if (category) {
            filteredPets = filteredPets.filter(pet => pet.category === category);
        }
        if (location) {
            filteredPets = filteredPets.filter(pet => pet.location.toLowerCase().startsWith(location.toLowerCase()));
        }

        setDisplayedPets(filteredPets);
    };

    const handleLocationInputChange = (event, value) => {
        setLocationFilter(value);
        if (value) {
            const suggestions = [...new Set((selectedType === 'lost' ? lostPets : foundPets)
                .filter(pet => pet.location.toLowerCase().startsWith(value.toLowerCase()))
                .map(pet => pet.location))];
            setLocationSuggestions(suggestions);
        } else {
            setLocationSuggestions([]);
            setDisplayedPets(selectedType === 'lost' ? lostPets : foundPets);
        }
    };

    const handleLocationChange = (event, newValue) => {
        if (newValue) {
            filterPets(selectedCategory, newValue);
        } else {
            setDisplayedPets(selectedType === 'lost' ? lostPets : foundPets);
        }
    };

    const handleSearch = () => {
        filterPets(selectedCategory, locationFilter);
    };


    return (
        <Grid>
            <Navbar />
            <Box flexGrow={1}>
                <Grid container justifyContent={"center"}>
                    <Grid item size={{ xs: 12, md: 10, lg: 9 }} height={"91.8vh"} overflow={"auto"}
                        sx={{ background: 'linear-gradient(to right, #0088ff8c, #007fff2b)' }}
                        boxShadow={"0px 5px 10px #b4b4b4"} py={3} px={{ xs: 1, sm: 3 }} className={`content ${showContent ? 'open' : 'closed'}`}>
                        <div>
                            <Grid container justifyContent={"center"} size={{ xs: 12 }} gap={1} mb={1}>
                                <Button
                                    onClick={() => handleTypeChange('lost')}
                                    variant={selectedType === "lost" ? "contained" : "outlined"}
                                    sx={{
                                        borderColor: "#ac5959",
                                        backgroundColor: selectedType === "lost" ? "#ac5959" : "white",
                                        color: selectedType === "lost" ? "white" : "#ac5959",
                                        "&:hover": {
                                            borderColor: "#ac5959",
                                            backgroundColor: selectedType === "lost" ? "#ac5959" : "rgba(172, 89, 89, 0.1)",
                                        },
                                    }}
                                >
                                    <Typography variant="body2">Lost Pets</Typography>
                                </Button>
                                <Button
                                    onClick={() => handleTypeChange('found')}
                                    variant={selectedType === "found" ? "contained" : "outlined"}
                                    sx={{
                                        borderColor: "#ac5959",
                                        backgroundColor: selectedType === "found" ? "#ac5959" : "white",
                                        color: selectedType === "found" ? "white" : "#ac5959",
                                        "&:hover": {
                                            borderColor: "#ac5959",
                                            backgroundColor: selectedType === "found" ? "#ac5959" : "rgba(172, 89, 89, 0.1)",
                                        },
                                    }}
                                >
                                    <Typography variant="body2">Found Pets</Typography>
                                </Button>
                            </Grid>
                            <Grid container size={{ xs: 12 }} justifyContent={"space-between"} mb={2}>
                                <Grid size={{ xs: 12, sm: 5, lg: 4 }} mt={{ xs: 2, md: 0 }}>
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
                                <Grid size={{ xs: 12, sm: 5, lg: 4 }} mt={{ xs: 2, md: 0 }}>
                                    <Autocomplete
                                        freeSolo
                                        value={locationFilter}
                                        onInputChange={handleLocationInputChange}
                                        onChange={handleLocationChange}
                                        options={locationSuggestions}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                handleSearch();
                                                event.preventDefault(); 
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Filter by Location"
                                                variant="outlined"
                                                fullWidth
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton onClick={handleSearch}>
                                                                <SearchIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container size={{ xs: 12 }}>
                                {displayedPets.length > 0 ? (
                                    displayedPets.map(pet => (
                                        <Grid item size={{ xs: 6, md: 3 }} key={pet._id}>
                                            <Link to={selectedType === 'lost' ? `/lost/${pet._id}` : `/listing/${pet._id}`} style={{ textDecoration: 'none' }}>
                                            <Card>
                                                <CardMedia
                                                    component="img"
                                                    height="180"
                                                    image={pet.images[0]} 
                                                    alt={pet.title}
                                                />
                                                <CardContent>
                                                    <Typography gutterBottom variant="h6" component="div">
                                                        {pet.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {pet.description}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                        {pet.location || 'Unknown'}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                        Posted by: {pet.createdBy || 'Unknown'}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                            </Link>
                                        </Grid>
                                    ))
                                ) : (
                                    <Typography variant="h6" textAlign="center" sx={{ mt: 2 }}>
                                        {selectedType === "lost" ? "There is no lost pet" : "There is no found pet"}
                                    </Typography>
                                )}
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </Grid>
    );
};

export default Pets;
