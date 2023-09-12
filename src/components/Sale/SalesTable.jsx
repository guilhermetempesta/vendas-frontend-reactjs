import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

import { TableFooter, useMediaQuery } from "@mui/material";
import Badge from '@mui/material/Badge';
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
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FilterListIcon from '@mui/icons-material/FilterList';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

import { getSales } from "../../services/sale";
import { currentDate, firstDayOfMonth, formatDatePtBr } from '../../commons/utils';
import { useNavigate } from "react-router-dom";
import { clearUserData } from "../../commons/authVerify";

import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFGenerator from "../PDFGenerator";

import AlertSnackbar from "../AlertSnackbar";
import Title from "../Title";

export default function SalesTable() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [showAlert, setShowAlert] = useState({show: false});
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [filters, setFilters] = useState({
    initialDate: firstDayOfMonth().toISOString().split('T')[0],
    finalDate: currentDate().toISOString().split('T')[0],
    customer: '',
  });
  const [dialogFilters, setTemporaryFilters] = useState({ ...filters });
  const [hasFilters, setHasFilters] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadSales = async () => {
      setIsLoading(true);
      const response = await getSales(filters);
      console.log(response);
      
      if (response.networkError) {
        clearUserData();
        navigate("/login");
      }

      if (response.status === 500) {
        setShowAlert({show: true, message: response.data.message, severity: 'error'});
        return;
      }

      if (response.status === 200) {
        setShowAlert({show: false, message: response.data.message, severity: 'success'});
        setRows(response.data);
      };

      setIsLoading(false);
    };

    console.log('useEffect')
    loadSales(navigate, filters);
  }, [navigate, filters]);
  
  const handleFilterClick = () => {
    setTemporaryFilters({ ...filters });
    setOpenDialog(true);
  };
  
  const handleFilterApply = () => {
    setOpenDialog(false);
    const filtersApplied =
      dialogFilters.initialDate.split('T')[0] !== firstDayOfMonth().toISOString().split('T')[0] ||
      dialogFilters.finalDate.split('T')[0] !== currentDate().toISOString().split('T')[0] ||
      dialogFilters.customer !== '';

    setHasFilters(filtersApplied);
    setFilters({ ...dialogFilters });
  };

  const handleFilterCancel = () => {
    setOpenDialog(false);
  };

  const handleFilterClear = () => {
    setTemporaryFilters({
      initialDate: firstDayOfMonth().toISOString().split('T')[0],
      finalDate: currentDate().toISOString().split('T')[0],
      customer: '',
    });
  };  
  
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
          {/* <TableCell>{format(new Date(row.date), 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: 'America/Sao_Paulo' })}</TableCell> */}
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
            <Collapse in={open} timeout="auto" unmountOnExit >
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

  function SumaryTable() {
    
    const invoiceTotal = (items) => {
      const totalSales = items.map(({ total }) => total).reduce((sum, i) => sum + i, 0);
      return totalSales.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    return (
      <React.Fragment>
        <TableRow sx={{bgcolor: "#f4f4f4"}}>
          <TableCell 
            style={{ color: 'rgb(25,118,210)', fontSize: '1rem', fontWeight: 'bold' }} colSpan={(isMobile) ? 3 : 4}
          >Total</TableCell>
          <TableCell 
            align="right" style={{ color: 'rgb(25,118,210)', fontSize: '1rem', fontWeight: 'bold' }}
          >{invoiceTotal(rows)}</TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  Row.propTypes = {
    row: PropTypes.shape({
      code: PropTypes.number.isRequired, 
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

  return (
    <div>
      <Title>
        <h2 style={{marginBottom: '4px'}}>Vendas</h2>
        {(!isLoading) &&
        <span>
          <IconButton
            onClick={handleFilterClick}
            color="primary"
          >
            <Badge badgeContent={hasFilters ? "!" : null} color="warning"> 
              <FilterListIcon />
            </Badge>
          </IconButton>
          <PDFDownloadLink document={<PDFGenerator data={rows}/>} fileName="Vendas.pdf">  
            {({ loadingReport }) =>
              loadingReport ? (
                <CircularProgress />
              ) : (
                <IconButton
                  color="primary"
                  aria-label="Exportar para PDF"
                  style={{ margin: "16px" }}
                >
                  <SaveAltIcon />
                </IconButton>
              )
            }
          </PDFDownloadLink>
        </span>}  
      </Title>
      {(isLoading) ? (
        <div
          style={{
            height: '70vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}  
        >
          <CircularProgress />
        </div>
      ) : (
      <>
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
              {rows.map((row, index) => (
                <Row key={index} row={row} />
              ))}
            </TableBody>
            <TableFooter>
              <SumaryTable/>
            </TableFooter>
          </Table>
        </TableContainer>
        <Dialog open={openDialog} onClose={handleFilterCancel}>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'rgb(235, 235, 235)',
            bgcolor: 'rgb(25, 118, 210)',
            padding: '16px', 
          }}
        >
          Filtros
          <FilterListIcon />
        </DialogTitle>
          <DialogContent>
          <Box mb={2} sx={{ marginTop: '16px' }}>
            <TextField
              label="Data Inicial"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={dialogFilters.initialDate.split('T')[0]}
              onChange={(e) =>
                setTemporaryFilters({ ...dialogFilters, initialDate: e.target.value })
              }
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Data Final"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={dialogFilters.finalDate.split('T')[0]}
              onChange={(e) =>
                setTemporaryFilters({ ...dialogFilters, finalDate: e.target.value })
              }
            />
          </Box>
          <Box>
            <TextField
              label="Cliente"
              value={dialogFilters.customer}
              onChange={(e) =>
                setTemporaryFilters({ ...dialogFilters, customer: e.target.value })
              }
            />
          </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFilterClear} color="primary">
              Limpar
            </Button>
            <Button onClick={handleFilterCancel} color="primary">
              Voltar
            </Button>
            <Button onClick={handleFilterApply} color="primary">
              Aplicar
            </Button>
          </DialogActions>
        </Dialog>
      </>
      )}      
      {
        (showAlert.show === true) &&  
        <AlertSnackbar setShowAlert={setShowAlert} show={showAlert.show} message={showAlert.message} severity={showAlert.severity} />
      }
    </div>
  );
}