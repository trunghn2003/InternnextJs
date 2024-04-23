import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Định nghĩa interface cho props của thành phần
interface EditCitizenProps {
    citizenId: number; // Giả sử citizenId là một số
    existingAvatarUrl: string;
    existingFullName: string;
    existingDateOfBirth: string;
    existingGender: string;
    existingIdentityCardNumber: string;
    existingEmail: string;
    existingAddress: string;
    existingPhoneNumber: string;
}

export const EditCitizen: React.FC<EditCitizenProps> = ({ citizenId, existingAvatarUrl, existingFullName, existingDateOfBirth, existingGender, existingIdentityCardNumber, existingEmail, existingAddress, existingPhoneNumber }) => {
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

    useEffect(() => {
        setAvatarUrl(existingAvatarUrl);
        setFullName(existingFullName);
        setDateOfBirth(existingDateOfBirth);
        setGender(existingGender);
        setIdentityCardNumber(existingIdentityCardNumber);
        setEmail(existingEmail);
        setAddress(existingAddress);
        setPhoneNumber(existingPhoneNumber);
    }, [existingAvatarUrl, existingFullName, existingDateOfBirth, existingGender, existingIdentityCardNumber, existingEmail, existingAddress, existingPhoneNumber]);

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
                const response = await fetch(`https://localhost:7004/api/Citizens/${citizenId}`, {
                    method: "PUT",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ avatarUrl, fullName, dateOfBirth, gender, identityCardNumber, email, address, phoneNumber })
                });

                if (!response.ok) {
                    throw new Error('Failed to update citizen.');
                }

                setSnackbarMessage('Citizen updated successfully.');
                setSnackbarOpen(true);
                queryClient.invalidateQueries(['citizens']);
            } catch (error) {
                setSnackbarMessage('Failed to update citizen.');
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
                    Edit Citizen
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
