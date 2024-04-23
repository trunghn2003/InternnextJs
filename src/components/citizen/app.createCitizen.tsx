import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const CreateCitizen = () => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [fullName, setFullName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [identityCardNumber, setIdentityCardNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
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
                const response = await fetch("https://localhost:7004/api/Citizens", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ avatarUrl, fullName, dateOfBirth, gender, identityCardNumber, email, address, phoneNumber })
                });

                if (!response.ok) {
                    throw new Error('Failed to add citizen.');
                }

                setSnackbarMessage('Citizen added successfully.');
                setSnackbarOpen(true);
                setAvatarUrl('');
                setFullName('');
                setDateOfBirth('');
                setGender('');
                setIdentityCardNumber('');
                setEmail('');
                setAddress('');
                setPhoneNumber('');
                queryClient.invalidateQueries('citizens');
            } catch (error) {
                setSnackbarMessage('Failed to add citizen.');
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
            <Button onClick={openPopup} color="primary" variant="contained">Add new</Button>
            <Dialog
                open={open}
                onClose={closePopup}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Add New Citizen
                    <IconButton onClick={closePopup} style={{ float: 'right' }}>
                        <CloseIcon color="primary" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} margin={2}>
                        <TextField
                            variant="outlined"
                            label="Avatar URL"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            label="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            label="Date of Birth"
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            label="Gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            label="Identity Card Number"
                            value={identityCardNumber}
                            onChange={(e) => setIdentityCardNumber(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            label="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            label="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
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
