import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';

import { TableFooter } from "@mui/material";
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
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
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import FilterListIcon from '@mui/icons-material/FilterList';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

import { getProductsReport } from "../../services/product";
import { currentDate, firstDayOfMonth, formatDatePtBr } from '../../commons/utils';
import { useNavigate } from "react-router-dom";
import { clearUserData } from "../../commons/authVerify";

import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFGenerator from "../PDFGenerator";

import AlertSnackbar from "../AlertSnackbar";
import Title from "../Title";

export default function ProductTable() {
  const navigate = useNavigate();
  
  const [showAlert, setShowAlert] = useState({show: false});
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    products: [],
    summary: {
      totalCost: 0,
		  totalSales: 0,
		  resultValue: 0,
		  resultPercent: 0
    }
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [filters, setFilters] = useState({
    initialDate: firstDayOfMonth().toISOString().split('T')[0],
    finalDate: currentDate().toISOString().split('T')[0],
    product: '',
  });
  const [dialogFilters, setTemporaryFilters] = useState({ ...filters });
  const [hasFilters, setHasFilters] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadProducts = async () => {
      setIsLoading(true);
      const response = await getProductsReport(filters);
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
        setData(response.data);
      };

      setIsLoading(false);
    };

    console.log('useEffect')
    loadProducts(navigate, filters);
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
      dialogFilters.product !== '';

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
      product: '',
    });
  };
  
  function Row(props) {
    const { row } = props;

    return (
      <React.Fragment>
        <TableRow>
          <TableCell component="th" scope="row">
            {row.name}
          </TableCell>
          <TableCell align="right">{row.soldAmount.toFixed(2).replace(".",",")}</TableCell>
          <TableCell align="right">{row.averagePrice.toFixed(2).replace(".",",")}</TableCell>
          <TableCell align="right">{row.totalDiscount.toFixed(2).replace(".",",")}</TableCell>
          <TableCell align="right">{row.totalSales.toFixed(2).replace(".",",")}</TableCell>
          <TableCell align="right">{row.unitCost.toFixed(2).replace(".",",")}</TableCell>
          <TableCell align="right">{row.totalCost.toFixed(2).replace(".",",")}</TableCell>
          <TableCell align="right">{row.resultValue.toFixed(2).replace(".",",")}</TableCell>
          <TableCell align="right">{row.resultPercent.toFixed(2).replace(".",",")}</TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  function SumaryTable() {
    
    return (
      <React.Fragment>
        <TableRow sx={{bgcolor: "#f4f4f4"}}>
          <TableCell 
            style={{ color: 'rgb(25,118,210)', fontSize: '1rem', fontWeight: 'bold' }} colSpan={4}
          >Total</TableCell>
          <TableCell 
            align="right" style={{ color: 'rgb(25,118,210)', fontSize: '1rem', fontWeight: 'bold' }} 
          >{data.summary.totalSales.toFixed(2).replace(".",",")}</TableCell>
          <TableCell 
            align="right" style={{ color: 'rgb(25,118,210)', fontSize: '1rem', fontWeight: 'bold' }} colSpan={2}
          >{data.summary.totalCost.toFixed(2).replace(".",",")}</TableCell>
          <TableCell 
            align="right" style={{ color: 'rgb(25,118,210)', fontSize: '1rem', fontWeight: 'bold' }}
          >{data.summary.resultValue.toFixed(2).replace(".",",")}</TableCell>
          <TableCell 
            align="right" style={{ color: 'rgb(25,118,210)', fontSize: '1rem', fontWeight: 'bold' }}
          >{data.summary.resultPercent.toFixed(2).replace(".",",")}</TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  Row.propTypes = {
    row: PropTypes.shape({
      products: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          soldAmount: PropTypes.number.isRequired,
          averagePrice: PropTypes.number.isRequired,
          subTotalSales: PropTypes.number.isRequired,
          totalSales: PropTypes.number.isRequired,
          unitCost: PropTypes.number.isRequired,
          totalCost: PropTypes.number.isRequired,
          resultValue: PropTypes.number.isRequired,
          resultPercent: PropTypes.number.isRequired,
        })
      ),//.isRequired,
      summary: PropTypes.shape({
        totalCost: PropTypes.number.isRequired,
        totalSales: PropTypes.number.isRequired,
        resultValue: PropTypes.number.isRequired,
        resultPercent: PropTypes.number.isRequired,
      }),
    }).isRequired,
  };

  return (
    <div>
      <Title>
        <span style={{marginBottom: '4px'}}>
          <h2 style={{marginBottom: '4px'}}>Produtos</h2>
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
          <PDFDownloadLink 
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
                <TableCell>Produto</TableCell>
                <TableCell align="right">Qtde</TableCell>
                <TableCell align="right">Preço Médio</TableCell>
                <TableCell align="right">Desconto</TableCell>
                <TableCell align="right">Total Vendas</TableCell>
                <TableCell align="right">Custo</TableCell>
                <TableCell align="right">Total Custo</TableCell>
                <TableCell align="right">Resultado R$</TableCell>
                <TableCell align="right">% Lucro</TableCell>
              </TableRow>  
            </TableHead>
            <TableBody>
              {data.products.map((row, index) => (
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
              label="Produto"
              value={dialogFilters.product}
              onChange={(e) =>
                setTemporaryFilters({ ...dialogFilters, product: e.target.value })
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