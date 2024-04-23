'use client'
import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
// import { CreateCitizen } from './app.modalCreate'; // Import component for creating new citizen
// import { EditCitizen } from './app.editCitizen'; // Import component for editing citizen
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateCitizen } from './app.createCitizen';
import { EditCitizen } from './app.editCitizen';

interface Citizen {
  id: number;
  avatarUrl: string;
  fullName: string;
  dateOfBirth: string; // Assuming dateOfBirth is a string in ISO format (YYYY-MM-DD)
  gender: string;
  identityCardNumber: string;
  email: string;
  address: string;
  phoneNumber: string;
}

function fetchCitizens() {
  return fetch('https://localhost:7004/api/Citizens')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    });
}

function TableCitizen() {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (id: number) => {
      try {
        const response = await fetch(`https://localhost:7004/api/Citizens/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error('Failed to delete citizen.');
        }
        queryClient.invalidateQueries(['citizens']);
      } catch (error) {
        console.log(error);
      }
    }
  });

  const { isFetching, error, data } = useQuery({
    queryKey: ['citizens'],
    queryFn: fetchCitizens
  });

  if (isFetching) return <div>Đang tải...</div>;
  if (error instanceof Error) return <div>Có lỗi xảy ra: {error.message}</div>;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Ảnh đại diện</TableCell>
            <TableCell align="right">Họ và tên</TableCell>
            <TableCell align="right">Ngày sinh</TableCell>
            <TableCell align="right">Giới tính</TableCell>
            <TableCell align="right">CMND</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Địa chỉ</TableCell>
            <TableCell align="right">Số điện thoại</TableCell>
            <TableCell align="right"><CreateCitizen /></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((citizen: Citizen) => (
            <TableRow
              key={citizen.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <img src={citizen.avatarUrl} alt="Avatar" />
              </TableCell>
              <TableCell align="right">{citizen.fullName}</TableCell>
              <TableCell align="right">{citizen.dateOfBirth}</TableCell>
              <TableCell align="right">{citizen.gender}</TableCell>
              <TableCell align="right">{citizen.identityCardNumber}</TableCell>
              <TableCell align="right">{citizen.email}</TableCell>
              <TableCell align="right">{citizen.address}</TableCell>
              <TableCell align="right">{citizen.phoneNumber}</TableCell>
              <TableCell align="right">
                <EditCitizen
                  citizenId={citizen.id}
                  existingAvatarUrl={citizen.avatarUrl}
                  existingFullName={citizen.fullName}
                  existingDateOfBirth={citizen.dateOfBirth}
                  existingGender={citizen.gender}
                  existingIdentityCardNumber={citizen.identityCardNumber}
                  existingEmail={citizen.email}
                  existingAddress={citizen.address}
                  existingPhoneNumber={citizen.phoneNumber}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ ml: 1 }}
                  onClick={() => mutate(citizen.id)}
                >
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableCitizen;
