import React, { useState } from "react";
import {
  Box,
  Snackbar,
  Alert,
  IconButton,
  Modal,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import { Grid } from "@mui/system";

const ListingModal = ({ open, onClose }) => {
  const [userName, setUserName] = useState(localStorage.getItem("username") || "username");
  const [listingData, setListingData] = useState({
    title: "",
    description: "",
    category: "",
    images: [],
    location: "",
    createdBy: userName || "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("Property"); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setListingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setListingData((prev) => ({
      ...prev,
      images: files,
    }));
    setSelectedFiles(files);
  };

  const handleClearFiles = () => {
    setSelectedFiles([]);
    setListingData((prev) => ({ ...prev, images: [] }));
    document.getElementById("file-upload").value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (listingData.images.length === 0) {
      setSnackbarMessage('Please select at least one image.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append('title', listingData.title);
    formData.append('description', listingData.description);
    formData.append('category', listingData.category);
    formData.append('location', listingData.location);
    formData.append('createdBy', userName);
    formData.append('type', selectedType);

    const imageFiles = listingData.images;
    imageFiles.forEach(file => {
      formData.append('images', file);
    });

    setLoading(true);

    try {
      const response = await fetch('https://lost-and-found-backend-red.vercel.app/api/listings', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setSnackbarMessage('Listing created successfully!');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Failed to create listing.');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      setSnackbarMessage('An error occurred.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setLoading(false);
      onClose();
    }
  };

  const categoryOptions = selectedType === "Property"
    ? ["Electronics", "Furniture", "Clothing", "Books", "Other"]
    : ["Dogs", "Cats", "Birds", "Reptiles", "Other Pets"];

    const backgroundImage = selectedType === "Property"
    ? 'url(/items.png)'
    : 'url(/pets.png)';

  return (
    <>
      <Modal open={open} onClose={onClose}>
      <Box
        height={"80%"}
        overflow={"scroll"}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "97%", sm: "90%", md: "80%", lg: "60%" },
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "10px",
          padding: "20px",
          overflow: "auto",
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: backgroundImage,
            backgroundSize: '50%',
            backgroundPosition: 'center',
            opacity: 0.1,
            height:{xs:"110%", sm:"100%"},
            zIndex: -1,
          },
        }}
      >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 5,
              right: 5,
              color: "text.secondary",
              zIndex: 999,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                variant={selectedType === "Property" ? "contained" : "outlined"}
                sx={{
                  borderColor: "#ac5959",
                  backgroundColor: selectedType === "Property" ? "#ac5959" : "white",
                  color: selectedType === "Property" ? "white" : "#ac5959",
                  "&:hover": {
                    borderColor: "#ac5959",
                    backgroundColor: selectedType === "Property" ? "#ac5959" : "rgba(172, 89, 89, 0.1)",
                  },
                }}
                onClick={() => setSelectedType("Property")}
              >
                <Typography variant="body2">Property</Typography>
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={selectedType === "Pets" ? "contained" : "outlined"}
                sx={{
                  borderColor: "#ac5959",
                  backgroundColor: selectedType === "Pets" ? "#ac5959" : "white",
                  color: selectedType === "Pets" ? "white" : "#ac5959",
                  "&:hover": {
                    borderColor: "#ac5959",
                    backgroundColor: selectedType === "Pets" ? "#ac5959" : "rgba(172, 89, 89, 0.1)",
                  },
                }}
                onClick={() => setSelectedType("Pets")}
              >
                <Typography variant="body2">Pets</Typography>
              </Button>
            </Grid>
          </Grid>
          <Typography display={"flex"} alignItems={"center"} gap={1} variant="h2Light">Post a Lost 
            <Typography color="#ac5959" variant="h2Light">{selectedType}</Typography>
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              name="title"
              label="Title"
              fullWidth
              required
              onChange={handleInputChange}
              margin="normal"
              sx={{backgroundColor:"white", border:"1px solid #ac5959", borderRadius:"9px"}}
            />
            <TextField
              name="description"
              label="Description"
              fullWidth
              required
              multiline
              rows={4}
              onChange={handleInputChange}
              margin="normal"
              sx={{backgroundColor:"white", border:"1px solid #ac5959", borderRadius:"9px"}}

            />

            <FormControl fullWidth required margin="normal">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={listingData.category}
                onChange={handleInputChange}
                label="Category"
                sx={{backgroundColor:"white", border:"1px solid #ac5959", borderRadius:"9px"}}
              >
                {categoryOptions.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              name="location"
              label="Where did you find it?"
              fullWidth
              required
              onChange={handleInputChange}
              margin="normal"
              value={listingData.location}
              sx={{backgroundColor:"white", border:"1px solid #ac5959", borderRadius:"9px"}}
            />

            <div>
              <Grid display={"flex"} alignItems={"center"}>
                <Typography>Select Image:</Typography>
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-upload">
                  <IconButton component="span">
                    <ImageIcon sx={{ fontSize: "3rem !important" }} />
                  </IconButton>
                </label>
              </Grid>
              {selectedFiles.length > 0 && (
                <Grid display={"flex"} gap={1} alignItems={"center"} mb={2}>
                  <Typography fontWeight={600}>Selected Files:</Typography>
                  {selectedFiles.map((file, index) => (
                    <Typography key={index}>{file.name} </Typography>
                  ))}
                    <Grid item>
                        <Button type="button" color="secondary" onClick={handleClearFiles}>
                            Clear
                        </Button>
                    </Grid>
                </Grid>
              )}
            </div>

            <Grid container spacing={2}>
              <Grid item>
                <Button type="submit" variant="contained" color="primary" sx={{ backgroundColor: "#ac5959" }} disabled={loading}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Listing'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ListingModal;
