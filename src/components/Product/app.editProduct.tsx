import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Định nghĩa interface cho props của thành phần
interface EditProductProps {
    productId: number; // Giả sử productId là một số
    existingName: string;
    existingImageUrl: string;
    existingPrice: number;
    existingCategory: string;
    existingReviews: number;
    existingStatus: string;
}

export const EditProduct: React.FC<EditProductProps> = ({ productId, existingName, existingImageUrl, existingPrice, existingCategory, existingReviews, existingStatus }) => {
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

    useEffect(() => {
        setName(existingName);
        setImageUrl(existingImageUrl);
        setPrice(existingPrice);
        setCategory(existingCategory);
        setReviews(existingReviews);
        setStatus(existingStatus);
    }, [existingName, existingImageUrl, existingPrice, existingCategory, existingReviews, existingStatus]);

    const openPopup = () => {
        setOpen(true);
    };

    const closePopup = () => {
        setOpen(false);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const { mutate } = useMutation({
        mutationFn: async () => {
            try {
                const response = await fetch(`https://localhost:7004/api/Products/${productId}`, {
                    method: "PUT",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, imageUrl, price, category, reviews, status })
                });

                if (!response.ok) {
                    throw new Error('Failed to update product.');
                }

                setSnackbarMessage('Product updated successfully.');
                setSnackbarOpen(true);
                queryClient.invalidateQueries(['products']);
            } catch (error) {
                setSnackbarMessage('Failed to update product.');
                setSnackbarOpen(true);
            }
        }
    });

    const handleUpdate = () => {
        mutate();
        closePopup();
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <Button onClick={openPopup} color="primary" variant="contained">Sửa</Button>
            <Dialog
                open={open}
                onClose={closePopup}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Edit Product
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
                    <Button color="primary" variant="contained" onClick={handleUpdate}>Update</Button>
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
