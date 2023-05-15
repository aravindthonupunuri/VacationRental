import React, { useState, useEffect } from "react";
import { Modal, Typography, Box, Divider, Button, Rating, TextField, CircularProgress } from "@mui/material";
// import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import '../assets/css/MyDataGrid.css';


export default function BookingsModal(props) {
  const { bookings, handleCloseBooking, open } = props;

  const columns = [
    { field: 'tenent', headerName: 'Tenant', width: 400 },
    { field: 'fromTimestamp', headerName: 'Starting Date', width: 200 },
    { field: 'toTimestamp', headerName: 'Ending Date', width: 200 },
  ];

  const [rowIdCounter, setRowIdCounter] = useState(0);

  const generateRowId = () => {
    setRowIdCounter((prevCounter) => prevCounter + 1);
    return rowIdCounter;
  };

  const getRowId = (bookings) => {
    return generateRowId();
  };



  return (
    <Modal
      open={open}
      onClose={handleCloseBooking}
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          boxShadow: 24,
          maxWidth: "1000px",
          width: "100%",
          p: 4,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Bookings<button type="button" className="btn-close" aria-label="Close" style={{ float: "right" }} onClick={handleCloseBooking}></button>
        </Typography>

        <Divider />
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={bookings}
            columns={columns}
            getRowId={getRowId}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            headerClassName="custom-header"
            pageSizeOptions={[5, 10]}
            checkboxSelection
          />
        </div>
        {/* <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tenant</TableCell>
              <TableCell>Starting Date</TableCell>
              <TableCell>Ending Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((rental) => (
              <TableRow >
                <TableCell>{rental.tenant}</TableCell>
                <TableCell>{rental.fromTimestamp}</TableCell>
                <TableCell>{rental.toTimestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> */}
      </Box>
    </Modal>
  );
}
