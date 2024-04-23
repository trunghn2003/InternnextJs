import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const CreateProduct = () => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('');
    const [reviews, setReviews] = useState(0);
    const [status, setStatus] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const openPopup = () => {
        setOpen(true);
    }

    const closePopup = () => {
        setOpen(false);
    }

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    }

    const { mutate } = useMutation({
        mutationFn: async () => {
            try {
                const response = await fetch("https://localhost:7004/api/Products", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, imageUrl, price, category, reviews, status })
                });

                if (!response.ok) {
                    throw new Error('Failed to add product.');
                }

                setSnackbarMessage('Product added successfully.');
                setSnackbarOpen(true);
                setName('');
                setImageUrl('');
                setPrice(0);
                setCategory('');
                setReviews(0);
                setStatus('');
                queryClient.invalidateQueries('products');
            } catch (error) {
                setSnackbarMessage('Failed to add product.');
                setSnackbarOpen(true);
            }
        }
    });

    const handleAdd = () => {
        mutate();
        closePopup();
    }

    return (
        <div style={{ textAlign: 'center' }}>
            <Button onClick={openPopup} color="primary" variant="contained">Add new product</Button>
            <Dialog
                open={open}
                onClose={closePopup}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Add New Product
                    <IconButton onClick={closePopup} style={{ float: 'right' }}>
                        <CloseIcon color="primary" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} margin={2}>
                        <TextField
                            variant="outlined"
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            label="Image URL"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            label="Price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(parseFloat(e.target.value))}
                        />
                        <TextField
                            variant="outlined"
                            label="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            label="Reviews"
                            type="number"
                            value={reviews}
                            onChange={(e) => setReviews(parseInt(e.target.value))}
                        />
                        <TextField
                            variant="outlined"
                            label="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="contained" onClick={handleAdd}>Add</Button>
                    <Button color="primary" variant="contained" onClick={closePopup}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </div>
    );
}
