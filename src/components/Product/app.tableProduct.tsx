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
// import { CreateProduct } from './app.modalCreate'; // Import component tạo sản phẩm
// import { EditProduct } from './app.editProduct'; // Import component chỉnh sửa sản phẩm
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateProduct } from './app.createProduct';
import { EditProduct } from './app.editProduct';

// Định nghĩa interface cho sản phẩm
interface Product {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
  reviews: number;
  status: string;
}

// Hàm fetch dữ liệu sản phẩm
function fetchProducts() {
  return fetch('https://localhost:7004/api/Products')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    });
}

function TableProduct() {
  const queryClient = useQueryClient();

  // Sử dụng useMutation để xử lý việc xóa sản phẩm
  const { mutate } = useMutation({
    mutationFn: async (productId : number) => {
      try {
        const response = await fetch(`https://localhost:7004/api/Products/${productId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
            console.log(productId);
          throw new Error('Failed to update product.');
        }
        queryClient.invalidateQueries(['products']);
      } catch (error) {
        console.log(error);
      }
    }
  });

  // Sử dụng useQuery để lấy dữ liệu sản phẩm
  const { isFetching, error, data } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  console.log(data);
  // Xử lý trường hợp đang tải hoặc có lỗi
  if (isFetching) return <div>Đang tải...</div>;
  if (error instanceof Error) return <div>Có lỗi xảy ra: {error.message}</div>;

  // Hiển thị bảng sản phẩm
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Mã sản phẩm</TableCell>
            <TableCell align="right">Tên</TableCell>
            <TableCell align="right">URL hình ảnh</TableCell>
            <TableCell align="right">Giá</TableCell>
            <TableCell align="right">Danh mục</TableCell>
            <TableCell align="right">Đánh giá</TableCell>
            <TableCell align="right">Trạng thái</TableCell>
            <TableCell align="right"><CreateProduct /></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((product: Product) => (
            <TableRow
              key={product.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {product.id}
              </TableCell>
              <TableCell align="right">{product.name}</TableCell>
              <TableCell align="right">{product.imageUrl}</TableCell>
              <TableCell align="right">{product.price}</TableCell>
              <TableCell align="right">{product.category}</TableCell>
              <TableCell align="right">{product.reviews}</TableCell>
              <TableCell align="right">{product.status}</TableCell>
              <TableCell align="right">
                <EditProduct
                  productId={product.id}
                  existingName={product.name}
                  existingImageUrl={product.imageUrl}
                  existingPrice={product.price}
                  existingCategory={product.category}
                  existingReviews={product.reviews}
                  existingStatus={product.status}
                />
              </TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  color="error"
                  sx={{ ml: 1 }}
                  onClick={() => mutate(product.id)}
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

export default TableProduct;
