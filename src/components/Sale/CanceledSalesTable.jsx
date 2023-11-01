import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

import { TableFooter, useMediaQuery } from "@mui/material";
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
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
import FilterListIcon from '@mui/icons-material/FilterList';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { getCanceledSales } from "../../services/sale";
import { currentDate, firstDayOfMonth, formatDatePtBr } from '../../commons/utils';
import { useNavigate } from "react-router-dom";
import { clearUserData } from "../../commons/authVerify";

import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFGenerator from "../PDFGenerator";

import AlertSnackbar from "../AlertSnackbar";
import Title from "../Title";

export default function CanceledSalesTable() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [showAlert, setShowAlert] = useState({show: false});
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [filters, setFilters] = useState({
    initialDate: firstDayOfMonth().toISOString().split('T')[0],
    finalDate: currentDate().toISOString().split('T')[0],
    user: '',
  });
  const [dialogFilters, setTemporaryFilters] = useState({ ...filters });
  const [hasFilters, setHasFilters] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadSales = async () => {
      setIsLoading(true);
      const response = await getCanceledSales(filters);
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
      dialogFilters.user !== '';

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
      user: '',
    });
  };
  
  function Row(props) {
    const { row } = props;
    const isMobile = useMediaQuery('(max-width:600px)');

    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' }} }         >
          <TableCell sx={{ padding: '4px' }}>
            <IconButton
              aria-label="more options"
              size="small"
              onClick={() => {
                setSelectedSale(row);
                setOpenViewDialog(true);
              }} 
            >
              <VisibilityIcon />
            </IconButton>
          </TableCell>
          {(!isMobile) && <TableCell>{row.code}</TableCell>}
          <TableCell>{formatDatePtBr(row.date)}</TableCell>
          <TableCell>{row.customer.name}</TableCell>
          {(!isMobile) && <TableCell>{row.user.name}</TableCell>}
          <TableCell align="right">
            {row.total.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
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
            style={{ color: 'rgb(25,118,210)', fontSize: '1rem', fontWeight: 'bold' }} colSpan={(isMobile) ? 3 : 5}
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
      user: PropTypes.shape({
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
          discount: PropTypes.number.isRequired,
        })
      ).isRequired,
    }).isRequired,
  };

  return (
    <div>
      <Title>
        <span style={{marginBottom: '4px'}}>
          <h2 style={{marginBottom: '4px'}}>Vendas Canceladas</h2>
          <p style={{margin: '2px'}}>{`${formatDatePtBr(filters.initialDate)} - ${formatDatePtBr(filters.finalDate)}`}</p>
        </span>
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
          <PDFDownloadLink document={<PDFGenerator data={rows} type='canceledSales'/>} fileName="VendasCanceladas.pdf">  
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
                {(!isMobile) && <TableCell>Vendedor</TableCell>}
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
 
        <Dialog
          open={openViewDialog}
          onClose={() => setOpenViewDialog(false)}
          fullWidth
          maxWidth="md"
        >
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
            Detalhes da Venda  
          </DialogTitle>
          {selectedSale && (
            <DialogContent>
              <Typography variant="h6">Código: {selectedSale.code}</Typography>
              <Typography variant="body1">Data: {formatDatePtBr(selectedSale.date)}</Typography>
              <Typography variant="body1">Cliente: {selectedSale.customer.name}</Typography>
              <Typography variant="body1">Vendedor: {selectedSale.user.name}</Typography>
              <Typography variant="h6" style={{ marginTop: '16px' }}>
                Itens da Venda:
              </Typography>
              <div 
                style={{ 
                  maxHeight: '250px', 
                  overflowY: 'auto',  
                  overflowX: 'auto' 
                }}
              >
                <Table size="small" aria-label="itens-venda">
                  <TableHead sx={{backgroundColor: "#f4f4f4"}}>
                    <TableRow >
                      <TableCell>Produto</TableCell>
                      <TableCell align="right">Quantidade</TableCell>
                      <TableCell align="right">Preço Unitário</TableCell>
                      <TableCell align="right">Desconto</TableCell>
                      <TableCell align="right">Preço Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedSale.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell align="right">{item.quantity.toFixed(3).replace(".",",")}</TableCell>
                        <TableCell align="right">{item.unitPrice.toFixed(2).replace(".",",")}</TableCell>
                        <TableCell align="right">{item.discount.toFixed(2).replace(".",",")}</TableCell>
                        <TableCell align="right">{item.totalPrice.toFixed(2).replace(".",",")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {(isMobile) ? ( 
                <div
                  style={{
                    marginTop: "10px",
                    padding: "6px",
                    backgroundColor: "#f4f4f4",
                    display: "table",
                    width: "100%",
                  }}
                >
                  <div style={{ display: "table-row" }}>
                    <div style={{ display: "table-cell", paddingRight: "8px" }}>
                      <Typography variant="body2">SubTotal (R$):</Typography>
                    </div>
                    <div style={{ display: "table-cell", textAlign: "right" }}>
                      <Typography variant="body1" fontWeight="bold" >
                        {selectedSale.subtotal.toFixed(2).replace(".", ",")}
                      </Typography>
                    </div>
                  </div>
                  <div style={{ display: "table-row" }}>
                    <div style={{ display: "table-cell", paddingRight: "8px" }}>
                      <Typography variant="body2">Desconto (R$):</Typography>
                    </div>
                    <div style={{ display: "table-cell", textAlign: "right" }}>
                      <Typography variant="body1" fontWeight="bold">
                        {selectedSale.discount.toFixed(2).replace(".", ",")}
                      </Typography>
                    </div>
                  </div>
                  <div style={{ display: "table-row" }}>
                    <div style={{ display: "table-cell", paddingRight: "8px" }}>
                      <Typography variant="body2">Total (R$):</Typography>
                    </div>
                    <div style={{ display: "table-cell", textAlign: "right" }}>
                      <Typography variant="body1" fontWeight="bold">
                        {selectedSale.total.toFixed(2).replace(".", ",")}
                      </Typography>
                    </div>
                  </div>
                </div>
              
              ) : (
                <div 
                  style={{
                    marginTop: "8px",
                    padding: "4px",
                    backgroundColor: "#f4f4f4",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span 
                    style={{ fontSize: '1rem', fontWeight: 'bold' }}
                  > SubTotal (R$): {selectedSale.subtotal.toFixed(2).replace(".",",")} </span>
                  <span 
                    style={{ fontSize: '1rem', fontWeight: 'bold' }}
                  > Desconto (R$): {selectedSale.discount.toFixed(2).replace(".",",")} </span>
                  <span 
                    style={{ fontSize: '1rem', fontWeight: 'bold' }}
                  > Total (R$): {selectedSale.total.toFixed(2).replace(".",",")} </span>
                </div>
              )}
            </DialogContent>
          )}
          <DialogActions>
            <Button onClick={() => setOpenViewDialog(false)} color="primary">
              Fechar
            </Button>
          </DialogActions>
        </Dialog>
 
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
          <Box mb={2}>
            <TextField
              label="Cliente"
              value={dialogFilters.customer}
              onChange={(e) =>
                setTemporaryFilters({ ...dialogFilters, customer: e.target.value })
              }
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Vendedor"
              value={dialogFilters.user}
              onChange={(e) =>
                setTemporaryFilters({ ...dialogFilters, user: e.target.value })
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