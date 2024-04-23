import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Define an interface for the component props
interface EditStudentProps {
    studentId: number; // Assuming studentId is a number
    existingFirstName: string;
    existingLastName: string;
    existingEmail: string;
}

export const EditStudent: React.FC<EditStudentProps> = ({ studentId, existingFirstName, existingLastName, existingEmail }) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        setFirstName(existingFirstName);
        setLastName(existingLastName);
        setEmail(existingEmail);
    }, [existingFirstName, existingLastName, existingEmail]);

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
                const response = await fetch(`https://localhost:7004/api/Students/${studentId}`, {
                    method: "PUT",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ firstName, lastName, email })
                });

                if (!response.ok) {
                    throw new Error('Failed to update student.');
                }

                setSnackbarMessage('Student updated successfully.');
                setSnackbarOpen(true);
                queryClient.invalidateQueries(['students']);
            } catch (error) {
                setSnackbarMessage('Failed to update student.');
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
                    Edit Student
                    <IconButton onClick={closePopup} style={{ float: 'right' }}>
                        <CloseIcon color="primary" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} margin={2}>
                        <TextField
                            variant="outlined"
                            label="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            label="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
