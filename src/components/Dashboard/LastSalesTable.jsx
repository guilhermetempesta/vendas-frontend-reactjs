import React, { useEffect, useState } from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../Title';
import { TableContainer } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { clearUserData } from '../../commons/authVerify';
import { getLastSales } from '../../services/dashboard';
import { formatDatePtBr } from '../../commons/utils';

export default function LastSalesTable() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadData = async () => {
      const response = await getLastSales();
      console.log(response);

      if (response.networkError) {
        clearUserData();
        navigate("/login");
      }

      if (response.status === 200) {
        console.log(response.data);
        setData(response.data);
      }

    };
    loadData();
  }, []);

  const handleClickViewMore = (event) => {
    event.preventDefault();
    navigate("/reports/sales");
  }

  return (
    <React.Fragment>
      <Title>Últimas Vendas</Title>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Vendedor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((element, index) => (
              <TableRow key={element._id}>
                <TableCell>{formatDatePtBr(element.date)}</TableCell>
                <TableCell align="right">{`R$ ${element.total.toFixed(2).replace(".", ",")}`}</TableCell>
                <TableCell>{element.customer.name}</TableCell>
                <TableCell>{element.user.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Link color="primary" onClick={(e) => handleClickViewMore(e)} sx={{ mt: 3, cursor: 'pointer' }}>
        Ver mais
      </Link>
    </React.Fragment>
  );
}
