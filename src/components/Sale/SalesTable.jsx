import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { salesMock } from '../../commons/mock';
import { formatDatePtBr } from '../../commons/utils';
import { useMediaQuery } from '@mui/material';

function Row(props) {
  const { row } = props;
  const isMobile = useMediaQuery('(max-width:600px)');
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell sx={{ padding: '6px' }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {(!isMobile) && <TableCell>{row.code}</TableCell>}
        <TableCell>{formatDatePtBr(row.date)}</TableCell>
        <TableCell>{row.customer.name}</TableCell>
        <TableCell align="right">
          {row.total.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Itens
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Produto</TableCell>
                    <TableCell align="right">Quantidade</TableCell>
                    <TableCell align="right">Preço Unitário</TableCell>
                    <TableCell align="right">Preço Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.items.map((itemsRow) => (
                    <TableRow key={itemsRow.product._id}>
                      <TableCell component="th" scope="row">
                        {itemsRow.product.name}
                      </TableCell>
                      <TableCell align="right">{itemsRow.quantity}</TableCell>
                      <TableCell align="right">
                        {itemsRow.unitPrice.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell align="right">
                        {itemsRow.totalPrice.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    code: PropTypes.number.isRequired, // Altere esta linha para aceitar um número
    date: PropTypes.string.isRequired,
    customer: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    total: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        product: PropTypes.shape({
          name: PropTypes.string.isRequired,
        }),
        quantity: PropTypes.number.isRequired,
        unitPrice: PropTypes.number.isRequired,
        totalPrice: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};


const rows = salesMock;
console.log(rows)

export default function CollapsibleTable() {
  const isMobile = useMediaQuery('(max-width:600px)');
    
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead sx={{bgcolor: '#f4f4f4'}}>
          <TableRow>
            <TableCell />
            {(!isMobile) && <TableCell>Código</TableCell>}
            <TableCell>Data</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell align="right">Valor&nbsp;(R$)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.code} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}