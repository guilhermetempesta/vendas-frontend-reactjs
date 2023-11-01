import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

import { Divider, TableFooter, Typography, useMediaQuery } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useNavigate } from "react-router-dom";
import { clearUserData } from "../../commons/authVerify";

import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFGenerator from "../PDFGenerator";

import AlertSnackbar from "../AlertSnackbar";
import Title from "../Title";
import { getSalesSummary } from "../../services/sale";

export default function ProductTable() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  const [showAlert, setShowAlert] = useState({show: false});
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);

    const loadData = async () => {
      setIsLoading(true);
      const response = await getSalesSummary();
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
    loadData(navigate);
  }, [navigate]);
    
  function Row(props) {
    const { row } = props;

    return (
      <React.Fragment>
        <TableRow>
        <TableCell sx={{ padding: '4px' }}>
            <IconButton
              aria-label="more options"
              size="small"
              onClick={() => {
                setSelectedMonth(row);
                setOpenViewDialog(true);
              }} 
            >
              <VisibilityIcon />
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.name}
          </TableCell>
          {(!isMobile) && <TableCell align="right">{row.salesQuantity.toFixed(2).replace(".",",")}</TableCell>}
          <TableCell align="right">{row.total.toFixed(2).replace(".",",")}</TableCell>
          {(!isMobile) && <TableCell align="right">{row.averageSalesValue.toFixed(2).replace(".",",")}</TableCell>}
        </TableRow>
      </React.Fragment>
    );
  }

  function TableFooter() {
    const invoiceTotal = (items) => {
      const totalSales = items.map(({ total }) => total).reduce((sum, i) => sum + i, 0);
      return totalSales.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    const invoiceQuantity = (items) => {
      const totalQuantity = items.map(({ salesQuantity }) => salesQuantity).reduce((sum, i) => sum + i, 0);
      return totalQuantity.toLocaleString('pt-BR', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });
    }

    return (
      <React.Fragment>
        <TableRow sx={{bgcolor: "#f4f4f4"}}>
          <TableCell 
            style={{ color: 'rgb(25,118,210)', fontSize: '1rem', fontWeight: 'bold' }} colSpan={2}
          >Total</TableCell>
          {(!isMobile) && 
            <TableCell 
              align="right" style={{ color: 'rgb(25,118,210)', fontSize: '1rem', fontWeight: 'bold' }} 
            >{invoiceQuantity(rows)}</TableCell>
          }
          <TableCell 
            align="right" style={{ color: 'rgb(25,118,210)', fontSize: '1rem', fontWeight: 'bold' }}
          >{invoiceTotal(rows)}</TableCell>
          {(!isMobile) && <TableCell/>}
        </TableRow>
      </React.Fragment>
    );
  }

  Row.propTypes = {
    row: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
    }).isRequired,
  };

  return (
    <div>
      <Title>
        <span style={{marginBottom: '4px'}}>
          <h2 style={{marginBottom: '4px'}}>Resumo de Vendas</h2>
          <p style={{margin: '2px'}}> Últimos 12 meses</p>
        </span>
        {(!isLoading) &&
        <span>
          {/* <PDFDownloadLink 
            document={<PDFGenerator data={data} type='products' subtitle={`${formatDatePtBr(filters.initialDate)} - ${formatDatePtBr(filters.finalDate)}`}/>} 
            fileName="ProdutosLucros.pdf">  
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
          </PDFDownloadLink> */}
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
                <TableCell></TableCell>
                <TableCell>Mês</TableCell>
                {(!isMobile) && <TableCell align="right">Quantidade</TableCell>}
                <TableCell align="right">Valor (R$)</TableCell>
                {(!isMobile) && <TableCell align="right">Valor Médio (R$)</TableCell>}
              </TableRow>  
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <Row key={index} row={row} />
              ))}
            </TableBody>
            <TableFooter>
              <TableFooter/>
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
          >Detalhes da Venda</DialogTitle>
          {selectedMonth && (
            <DialogContent>
              <Typography variant="h6">Mês: {selectedMonth.name}</Typography>
              <Divider/>
              <Typography variant="body1">
                Total de vendas (R$): {selectedMonth.total.toFixed(2).replace(".",",")} 
              </Typography>
              <Typography variant="body1">
                Quantidade de vendas: {selectedMonth.salesQuantity} 
              </Typography>
              <Typography variant="body1">
                Valor médio da venda (R$): {selectedMonth.averageSalesValue.toFixed(2).replace(".",",")} 
              </Typography>
              <Divider/>
              <Typography variant="h6" style={{ marginTop: '16px' }}>
                Top 3: Produtos
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
                      <TableCell align="right">Quant.</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedMonth.topProducts.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{(item.name) ? item.name : '-'}</TableCell>
                        <TableCell align="right">
                          {(item.amount) ? item.amount : '0'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Divider/>
              <Typography variant="h6" style={{ marginTop: '16px' }}>
                Top 3: Clientes
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
                      <TableCell>Cliente</TableCell>
                      <TableCell align="right">Valor (R$)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedMonth.topCustomers.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{(item.name) ? item.name : '-'}</TableCell>
                        <TableCell align="right">
                          {(item.total) ? item.total.toFixed(2).replace(".",",") : '0.00'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Divider/>
              <Typography variant="h6" style={{ marginTop: '16px' }}>
                Top 3: Vendedores
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
                      <TableCell>Vendedor</TableCell>
                      <TableCell align="right">Valor (R$)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedMonth.topUsers.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{(item.name) ? item.name : '-'}</TableCell>
                        <TableCell align="right">
                          {(item.amount) ? item.amount.toFixed(2).replace(".",",") : '0.00'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* <div 
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
                > Total (R$): {selectedMonth.total.toFixed(2).replace(".",",")} </span>
              </div> */}
            </DialogContent>
          )}
          <DialogActions>
            <Button onClick={() => setOpenViewDialog(false)} color="primary">
              Fechar
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