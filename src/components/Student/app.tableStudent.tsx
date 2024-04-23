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
import { CreateStudent } from './app.modalCreate';
import { EditStudent } from './app.editStudent';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Student {
  studentId: number;
  firstName: string;
  lastName: string;
  email: string;
}

function fetchStudents() {

  return fetch('https://localhost:7004/api/Students')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    });
}
function TableStudent() {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (studentId : number) => {
      try {
        const response = await fetch(`https://localhost:7004/api/Students/${studentId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error('Failed to update student.');
        }
        queryClient.invalidateQueries(['students']);
      } catch (error) {
        console.log(error);
      }
    }
  });

  const { isFetching, error, data } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents
  });


  if (isFetching) return <div>Đang tải...</div>;
  if (error instanceof Error) return <div>Có lỗi xảy ra: {error.message}</div>;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Mã sinh viên</TableCell>
            <TableCell align="right">Họ</TableCell>
            <TableCell align="right">Tên</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right"><CreateStudent /></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((student: Student) => (
            <TableRow
              key={student.studentId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {student.studentId}
              </TableCell>
              <TableCell align="right">{student.firstName}</TableCell>
              <TableCell align="right">{student.lastName}</TableCell>
              <TableCell align="right">{student.email}</TableCell>
              <TableCell align="right">
                <Button variant="contained" color="primary">Xem</Button>
              </TableCell>
              <TableCell align="right">
              <EditStudent
                  studentId={student.studentId}
                  existingFirstName={student.firstName}
                  existingLastName={student.lastName}
                  existingEmail={student.email}
                />
              </TableCell>
              <TableCell>
                
                <Button
                  variant="contained"
                  color="error"
                  sx={{ ml: 1 }}
                  onClick={() => mutate(student.studentId)}
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

export default TableStudent;
